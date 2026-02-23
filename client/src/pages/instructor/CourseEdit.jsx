import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function CourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', shortDescription: '', price: 0, discountPrice: 0,
        category: '', subcategory: '', level: 'beginner', language: 'English',
        tags: '', requirements: '', goals: '', status: 'draft',
    });
    const [sections, setSections] = useState([]);

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.data));
        if (!isNew) {
            api.get(`/courses/${id}`).then(res => {
                const c = res.data.data;
                setForm({
                    title: c.title || '', description: c.description || '', shortDescription: c.shortDescription || '',
                    price: c.price || 0, discountPrice: c.discountPrice || 0,
                    category: c.category?._id || c.category || '', subcategory: c.subcategory?._id || c.subcategory || '',
                    level: c.level || 'beginner', language: c.language || 'English',
                    tags: (c.tags || []).join(', '), requirements: (c.requirements || []).join('\n'), goals: (c.goals || []).join('\n'),
                    status: c.status || 'draft',
                });
            });
            api.get(`/sections/course/${id}`).then(res => setSections(res.data.data || []));
        }
    }, [id, isNew]);

    useEffect(() => {
        if (form.category) api.get(`/subcategories?category=${form.category}`).then(res => setSubcategories(res.data.data));
    }, [form.category]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form, price: Number(form.price), discountPrice: Number(form.discountPrice),
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                requirements: form.requirements.split('\n').filter(Boolean),
                goals: form.goals.split('\n').filter(Boolean),
            };
            let res;
            if (isNew) { res = await api.post('/courses', payload); navigate(`/instructor/courses/${res.data.data._id}/edit`); }
            else { res = await api.put(`/courses/${id}`, payload); }
            toast.success('Course saved!');
        } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
        setSaving(false);
    };

    // Sections & Lectures
    const addSection = async () => {
        try {
            const res = await api.post('/sections', { course: id, title: 'New Section' });
            setSections([...sections, { ...res.data.data, lectures: [] }]);
            toast.success('Section added');
        } catch { toast.error('Error'); }
    };

    const updateSection = async (sectionId, title) => {
        try { await api.put(`/sections/${sectionId}`, { title }); } catch { }
    };

    const deleteSection = async (sectionId) => {
        if (!window.confirm('Delete section?')) return;
        try { await api.delete(`/sections/${sectionId}`); setSections(sections.filter(s => s._id !== sectionId)); toast.success('Deleted'); } catch { }
    };

    const addLecture = async (sectionId) => {
        try {
            const res = await api.post('/lectures', { section: sectionId, course: id, title: 'New Lecture' });
            setSections(sections.map(s => s._id === sectionId ? { ...s, lectures: [...(s.lectures || []), res.data.data] } : s));
            toast.success('Lecture added');
        } catch { toast.error('Error'); }
    };

    const updateLecture = async (lecId, updates) => {
        try { await api.put(`/lectures/${lecId}`, updates); } catch { }
    };

    const deleteLecture = async (sectionId, lecId) => {
        try {
            await api.delete(`/lectures/${lecId}`);
            setSections(sections.map(s => s._id === sectionId ? { ...s, lectures: (s.lectures || []).filter(l => l._id !== lecId) } : s));
            toast.success('Deleted');
        } catch { }
    };

    return (
        <DashboardLayout role="instructor">
            <div className="page-header">
                <h1 className="page-title">{isNew ? 'Create New Course' : 'Edit Course'}</h1>
            </div>

            <div className="tabs">
                {['basic', 'curriculum'].map(t => (
                    <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t === 'basic' ? 'Course Details' : 'Curriculum'}</div>
                ))}
            </div>

            {activeTab === 'basic' && (
                <form onSubmit={handleSave} style={{ maxWidth: 700 }}>
                    <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Short Description</label><input className="form-input" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ minHeight: 200 }} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">Subcategory</label><select className="form-select" value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })}><option value="">Select</option>{subcategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">Price ($)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" step="0.01" /></div>
                        <div className="form-group"><label className="form-label">Discount Price ($)</label><input type="number" className="form-input" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} min="0" step="0.01" /></div>
                        <div className="form-group"><label className="form-label">Level</label><select className="form-select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="all">All Levels</option></select></div>
                        <div className="form-group"><label className="form-label">Language</label><input className="form-input" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} /></div>
                        <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="active">Published</option></select></div>
                    </div>
                    <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Requirements (one per line)</label><textarea className="form-textarea" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Learning Goals (one per line)</label><textarea className="form-textarea" value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} /></div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save Course'}</button>
                </form>
            )}

            {activeTab === 'curriculum' && (
                <div style={{ maxWidth: 800 }}>
                    {!isNew ? (
                        <>
                            {sections.map(section => (
                                <div key={section._id} className="card" style={{ marginBottom: 12 }}>
                                    <div className="card-body" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <input className="form-input" defaultValue={section.title} onBlur={e => updateSection(section._id, e.target.value)} style={{ flex: 1, fontWeight: 600 }} />
                                        <button className="btn btn-sm btn-secondary" onClick={() => addLecture(section._id)}><FiPlus /> Lecture</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteSection(section._id)}><FiTrash2 /></button>
                                    </div>
                                    {section.lectures?.map(lec => (
                                        <div key={lec._id} style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <input className="form-input" defaultValue={lec.title} onBlur={e => updateLecture(lec._id, { title: e.target.value })} style={{ flex: 1, fontSize: 13 }} />
                                            <input className="form-input" placeholder="YouTube URL" defaultValue={lec.youtubeUrl} onBlur={e => updateLecture(lec._id, { youtubeUrl: e.target.value })} style={{ flex: 1, fontSize: 13 }} />
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                                                <input type="checkbox" defaultChecked={lec.isFreePreview} onChange={e => updateLecture(lec._id, { isFreePreview: e.target.checked })} /> Preview
                                            </label>
                                            <button className="btn btn-sm" style={{ color: 'var(--error)', background: 'none' }} onClick={() => deleteLecture(section._id, lec._id)}><FiTrash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button className="btn btn-secondary" onClick={addSection}><FiPlus /> Add Section</button>
                        </>
                    ) : (
                        <div className="alert alert-warning">Save the course first, then add sections and lectures.</div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
