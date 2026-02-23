import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheck, FiPlay, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';

export default function CourseLearn() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [activeLecture, setActiveLecture] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/courses/${courseId}`),
            api.get(`/enrollments/my-courses`),
        ]).then(([courseRes, enrollRes]) => {
            setCourse(courseRes.data.data);
            const enr = (enrollRes.data.data || []).find(e => (e.course?._id || e.course) === courseId);
            setEnrollment(enr);
            // Set first lecture as active
            const sections = courseRes.data.data.sections || [];
            if (sections.length > 0 && sections[0].lectures?.length > 0) {
                setActiveLecture(sections[0].lectures[0]);
                setExpandedSections({ [sections[0]._id]: true });
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [courseId]);

    const markComplete = async (lectureId) => {
        try {
            const res = await api.put(`/enrollments/${courseId}/progress`, { lectureId });
            setEnrollment(prev => ({ ...prev, completedLectures: res.data.data.completedLectures, progress: res.data.data.progress }));
            toast.success('Progress updated!');
        } catch { }
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
    };

    const downloadCertificate = async () => {
        try {
            const res = await api.get(`/enrollments/${courseId}/certificate`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = 'certificate.pdf'; a.click();
            toast.success('Certificate downloaded!');
        } catch { toast.error('Certificate not available yet'); }
    };

    const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;
    if (!course) return <div className="container section"><div className="empty-state"><div className="empty-state-title">Course not found</div></div></div>;

    const isCompleted = (lecId) => enrollment?.completedLectures?.includes(lecId);

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
            {/* Sidebar - Curriculum */}
            <div style={{ width: 340, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
                <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{course.title}</h3>
                    <div className="progress-bar" style={{ marginBottom: 4 }}>
                        <div className="progress-bar-fill" style={{ width: `${enrollment?.progress || 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>{enrollment?.progress || 0}% complete</span>
                        {enrollment?.progress === 100 && <button onClick={downloadCertificate} style={{ color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}><FiDownload /> Certificate</button>}
                    </div>
                </div>

                {course.sections?.map(section => (
                    <div key={section._id}>
                        <div onClick={() => toggleSection(section._id)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', fontWeight: 600, fontSize: 13 }}>
                            <span>{section.title}</span>
                            {expandedSections[section._id] ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </div>
                        {expandedSections[section._id] && section.lectures?.map(lec => (
                            <div key={lec._id} onClick={() => setActiveLecture(lec)} style={{
                                padding: '10px 16px 10px 28px', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center',
                                fontSize: 13, color: activeLecture?._id === lec._id ? 'var(--primary-light)' : 'var(--text-secondary)',
                                background: activeLecture?._id === lec._id ? 'var(--primary-glow)' : 'transparent',
                                borderLeft: activeLecture?._id === lec._id ? '3px solid var(--primary)' : '3px solid transparent',
                            }}>
                                {isCompleted(lec._id) ? <FiCheck color="var(--success)" size={14} /> : <FiPlay size={12} />}
                                <span style={{ flex: 1 }}>{lec.title}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lec.duration || 0}m</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Main Content - Video */}
            <div style={{ flex: 1, padding: 0 }}>
                {activeLecture ? (
                    <>
                        <div style={{ background: '#000', aspectRatio: '16/9', maxHeight: 'calc(100vh - 180px)' }}>
                            <iframe src={getYoutubeEmbedUrl(activeLecture.youtubeUrl)} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{activeLecture.title}</h2>
                                <button onClick={() => markComplete(activeLecture._id)} className={`btn btn-sm ${isCompleted(activeLecture._id) ? 'btn-success' : 'btn-secondary'}`}>
                                    <FiCheck /> {isCompleted(activeLecture._id) ? 'Completed' : 'Mark Complete'}
                                </button>
                            </div>
                            {activeLecture.description && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{activeLecture.description}</p>}
                        </div>
                    </>
                ) : (
                    <div className="empty-state" style={{ marginTop: 100 }}>
                        <div className="empty-state-icon">🎬</div>
                        <div className="empty-state-title">Select a lecture to start</div>
                    </div>
                )}
            </div>
        </div>
    );
}
