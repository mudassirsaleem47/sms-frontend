import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, User, BookOpen, Users, Bus, Save, Check, Calendar as DollarSign, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordField } from '@/components/ui/email-pass';

import API_URL from '@/config/api';
const API_BASE = API_URL;

const toInputDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

const getSessionLabel = (session) => {
    if (!session) return 'Session';
    if (session.sessionYear) return session.sessionYear;
    if (session.sessionName) return session.sessionName;

    const start = session.startDate ? new Date(session.startDate).getFullYear() : null;
    const end = session.endDate ? new Date(session.endDate).getFullYear() : null;
    if (start && end) return `${start}-${end}`;
    if (start) return `${start}`;

    return 'Session';
};

const isValidObjectId = (value) => (
    typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
);

const resolveSchoolId = (user) => {
    if (!user) return '';
    if (user.userType === 'admin') return isValidObjectId(user._id) ? user._id : '';
    if (typeof user.school === 'string') return isValidObjectId(user.school) ? user.school : '';
    if (user.school && typeof user.school === 'object') {
        return isValidObjectId(user.school._id) ? user.school._id : '';
    }
    return isValidObjectId(user._id) ? user._id : '';
};

const StudentAdmissionForm = ({ onSuccess, onCancel, editStudentId }) => {
    const { currentUser, activeSession } = useAuth();
    const { campuses, selectedCampus, isMainAdmin } = useCampus();

    // --- State ---
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [sessionsList, setSessionsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nextAdmissionNum, setNextAdmissionNum] = useState('');
    const [routesList, setRoutesList] = useState([]);
    const [pickupPointsList, setPickupPointsList] = useState([]);
    const [transportLoading, setTransportLoading] = useState(false);
    const [feeStructuresList, setFeeStructuresList] = useState([]);
    const [selectedFees, setSelectedFees] = useState([]);
    const [allStudentsList, setAllStudentsList] = useState([]);
    const [isSiblingDialogOpen, setIsSiblingDialogOpen] = useState(false);
    const [siblingSearchTerm, setSiblingSearchTerm] = useState('');
    const [siblingDraft, setSiblingDraft] = useState({
        name: '',
        class: '',
        section: '',
        rollNum: '',
        school: '',
        siblingStudentId: ''
    });
    const [isParentAutoFilledFromSibling, setIsParentAutoFilledFromSibling] = useState(false);

    const [guardianType, setGuardianType] = useState('father'); // 'father', 'mother', 'other'

    const initialFormState = {
        name: '', 
        rollNum: '',
        password: '',
        sclassName: '',
        section: '',
        school: currentUser?._id || '',
        campus: selectedCampus?._id || '',
        status: 'Active', // IMPORTANT: Students must be Active to display

        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        category: 'General',
        mobileNumber: '',
        email: '',

        admissionDate: toInputDate(new Date()),
        session: activeSession?._id || '', // Will be set in useEffect based on activeSession
        bloodGroup: '',
        house: '',
        height: '',
        weight: '',
        measurementDate: toInputDate(new Date()),

        religion: '',
        caste: '',

        father: { name: '', phone: '', occupation: '', email: '', address: '' },
        mother: { name: '', phone: '', occupation: '', email: '', address: '' },
        guardian: { name: '', phone: '', occupation: '', email: '', address: '', relation: '' },

        transport: { route: '', pickupPoint: '', feesMonth: '' },
        siblings: [],
        studentPhotoUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [photos, setPhotos] = useState({
        studentPhoto: null,
        fatherPhoto: null,
        motherPhoto: null,
        guardianPhoto: null
    });

    const [previews, setPreviews] = useState({
        studentPhoto: null,
        fatherPhoto: null,
        motherPhoto: null,
        guardianPhoto: null
    });

    const getAuthConfig = React.useCallback(() => {
        try {
            const token = localStorage.getItem('authToken');
            return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        } catch {
            return {};
        }
    }, []);

    const getSchoolId = React.useCallback(() => (
        resolveSchoolId(currentUser)
    ), [currentUser]);

    const getCampusId = React.useCallback((campusValue) => {
        if (!campusValue) return '';
        if (typeof campusValue === 'string') {
            return isValidObjectId(campusValue) ? campusValue : '';
        }
        return isValidObjectId(campusValue?._id) ? campusValue._id : '';
    }, []);

    const fetchSessions = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;
            const response = await axios.get(`${API_BASE}/Sessions/${schoolId}`, getAuthConfig());
            const sessions = Array.isArray(response.data) ? response.data : (response.data?.sessions || []);
            setSessionsList(sessions);
        } catch (err) {
            console.error('Error fetching sessions:', err);
        }
    }, [getSchoolId, getAuthConfig]);

    // --- Effects & Fetchers ---
    useEffect(() => {
        if (currentUser) {
            fetchSessions();
        }
    }, [currentUser, fetchSessions]);

    const fetchNextAdmissionNum = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;
            const requestConfig = {
                ...getAuthConfig(),
                params: {
                    ...(activeSession?._id ? { session: activeSession._id } : {}),
                    ...(formData.academicYear ? { academicYear: formData.academicYear } : {})
                }
            };
            const res = await axios.get(`${API_BASE}/NextAdmissionNumber/${schoolId}`, requestConfig);
            setNextAdmissionNum(res.data.nextAdmissionNum);
        } catch (err) {
            console.error("Failed to fetch next admission number", err);
        }
    }, [getSchoolId, getAuthConfig, activeSession, formData.academicYear]);

    const fetchRoutes = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;
            const res = await axios.get(`${API_BASE}/Transport/Route/${schoolId}`, getAuthConfig());
            setRoutesList(res.data);
        } catch (err) {
            console.error("Failed to load routes", err);
        }
    }, [getSchoolId, getAuthConfig]);

    const fetchPickupPoints = async (routeId) => {
        if (!routeId) {
            setPickupPointsList([]);
            return;
        }
        setTransportLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/Transport/RouteStop/${routeId}`, getAuthConfig());
            // RouteStop returns an array of stops, each with a pickupPoint object
            setPickupPointsList(res.data);
        } catch (err) {
            console.error("Failed to load pickup points", err);
            toast.error("Failed to load pickup points");
        } finally {
            setTransportLoading(false);
        }
    };

    const fetchClasses = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;
            const selectedCampusId = getCampusId(selectedCampus);
            const campusQuery = selectedCampusId ? `?campus=${selectedCampusId}` : '';
            const res = await axios.get(`${API_BASE}/Sclasses/${schoolId}${campusQuery}`, getAuthConfig());
            const classes = Array.isArray(res.data) ? res.data : (res.data?.classes || []);
            setClassesList(classes);
        } catch {
            toast.error("Failed to load classes");
        }
    }, [getSchoolId, getCampusId, getAuthConfig, selectedCampus]);

    const fetchAvailableFees = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;
            const selectedCampusId = getCampusId(selectedCampus);
            const campusQuery = selectedCampusId ? `?campus=${selectedCampusId}` : '';
            const res = await axios.get(`${API_BASE}/FeeStructures/${schoolId}${campusQuery}`, getAuthConfig());
            setFeeStructuresList(res.data);
        } catch (err) {
            console.error("Failed to fetch fees", err);
        }
    }, [getSchoolId, getCampusId, getAuthConfig, selectedCampus]);

    useEffect(() => {
        if (currentUser) {
            fetchClasses();
            fetchAvailableFees();
            if (!editStudentId) {
                fetchNextAdmissionNum();
            }
            fetchRoutes();
        }
    }, [currentUser, fetchClasses, fetchNextAdmissionNum, fetchRoutes, editStudentId, fetchAvailableFees]);

    // Fetch student data if edit mode
    useEffect(() => {
        const fetchStudentForEdit = async () => {
            if (!editStudentId) return;
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/Student/${editStudentId}`);
                const data = res.data;
                
                // Map API data to formData structure
                setFormData({
                    ...initialFormState,
                    ...data,
                    sclassName: data.sclassName?._id || data.sclassName || '',
                    campus: data.campus?._id || data.campus || selectedCampus?._id || '',
                    dateOfBirth: toInputDate(data.dateOfBirth),
                    admissionDate: toInputDate(data.admissionDate) || toInputDate(new Date()),
                    measurementDate: toInputDate(data.measurementDate) || toInputDate(new Date()),
                    father: data.father || initialFormState.father,
                    mother: data.mother || initialFormState.mother,
                    guardian: data.guardian || initialFormState.guardian,
                    transport: data.transport || initialFormState.transport,
                    siblings: data.siblings || [],
                    studentPhotoUrl: data.studentPhotoUrl || '' // Ensure this field exists in your API
                });

                // Populate Previews
                const getPreview = (path) => path ? (path.startsWith('http') ? path : `${API_BASE}/${path?.replace(/\\/g, '/')}`) : null;
                setPreviews({
                    studentPhoto: getPreview(data.studentPhoto),
                    fatherPhoto: getPreview(data.father?.photo),
                    motherPhoto: getPreview(data.mother?.photo),
                    guardianPhoto: getPreview(data.guardian?.photo),
                });

                // Determine active guardian tab
                if (data.guardian?.name) setGuardianType('other');
                else if (data.mother?.name && !data.father?.name) setGuardianType('mother');
                else setGuardianType('father');

                // Pre-fetch sections if class is selected
                if (data.sclassName) {
                    const classId = data.sclassName?._id || data.sclassName;
                    // Note: classesList might not be loaded yet, so we'll rely on the API returning valid sections for the class
                    try {
                         const schoolId = getSchoolId();
                         if (!schoolId) return;
                         const cRes = await axios.get(`${API_BASE}/Sclasses/${schoolId}`, getAuthConfig());
                         const selectedClass = cRes.data.find(c => c._id === classId);
                         if (selectedClass) setSectionsList(selectedClass.sections);
                         setClassesList(cRes.data);
                    } catch (e) {}
                }

                // If transport route exists, fetch pickup points
                if (data.transport?.route) {
                    fetchPickupPoints(data.transport.route); // pass route ID if stored, though it might be stored by string in db. Let it try.
                }

            } catch (err) {
                 toast.error("Failed to load student details for editing");
                 console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (editStudentId && currentUser) {
            fetchStudentForEdit();
        }
    }, [editStudentId, currentUser, getSchoolId, getAuthConfig]);

    useEffect(() => {
        if (activeSession) {
            setFormData(prev => ({ ...prev, session: activeSession._id }));
        }
    }, [activeSession]);

    useEffect(() => {
        const defaultCampusId = getCampusId(selectedCampus) || getCampusId(campuses[0]) || '';
        if (!defaultCampusId) return;

        setFormData(prev => {
            // Preserve existing campus in edit mode when already present.
            if (editStudentId && prev.campus) return prev;
            if (prev.campus === defaultCampusId) return prev;
            return { ...prev, campus: defaultCampusId };
        });
    }, [selectedCampus, campuses, editStudentId, getCampusId]);

    // Sync formData.school with currentUser to ensure school is always up-to-date
    useEffect(() => {
        if (!editStudentId) {
            const schoolId = getSchoolId();
            if (schoolId && formData.school !== schoolId) {
                setFormData(prev => ({ ...prev, school: schoolId }));
            }
        }
    }, [currentUser, getSchoolId, editStudentId]);

    // --- Handlers ---
    const handleInputChange = (e, section = null, index = null) => {
        const { name, value } = e.target;
        updateFormState(name, value, section, index);
    };

    const handleSelectChange = (name, value, section = null, index = null) => {
        updateFormState(name, value, section, index);
    };

    const updateFormState = (name, value, section, index) => {
        if (name === 'sclassName') {
            const selectedClass = classesList.find(c => c._id === value);
            setSectionsList(selectedClass ? selectedClass.sections : []);
            setFormData(prev => ({ ...prev, [name]: value, section: '' }));
        } else if (name === 'route' && section === 'transport') {
            const selectedRoute = routesList.find(r => r._id === value);
            setFormData(prev => ({
                ...prev,
                transport: { ...prev.transport, route: selectedRoute?.routeTitle || value, pickupPoint: '' }
            }));
            fetchPickupPoints(value);
        } else if (section === 'siblings' && index !== null) {
            const newSiblings = [...formData.siblings];
            const existingSibling = newSiblings[index] || {};

            if (name === 'class') {
                newSiblings[index] = { ...existingSibling, class: value, section: '' };
            } else {
                newSiblings[index] = { ...existingSibling, [name]: value };
            }

            setFormData(prev => ({ ...prev, siblings: newSiblings }));
        } else if (section) {
            if (['father', 'mother', 'guardian'].includes(section)) {
                setIsParentAutoFilledFromSibling(false);
            }
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotos(prev => ({ ...prev, [type]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (type) => {
        setPhotos(prev => ({ ...prev, [type]: null }));
        setPreviews(prev => ({ ...prev, [type]: null }));
        if (type === 'studentPhoto') {
            setFormData(prev => ({ ...prev, studentPhotoUrl: '' }));
        }
    };

    const addSibling = () => {
        setSiblingDraft({
            name: '',
            class: '',
            section: '',
            rollNum: '',
            school: '',
            siblingStudentId: ''
        });
        setSiblingSearchTerm('');
        setIsSiblingDialogOpen(true);
    };

    const removeSibling = (index) => {
        const newSiblings = formData.siblings.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, siblings: newSiblings }));
    };

    const fetchStudentsForSiblingLookup = React.useCallback(async () => {
        try {
            const schoolId = getSchoolId();
            if (!schoolId) return;

            const selectedCampusId = getCampusId(selectedCampus);
            const requestConfig = {
                ...getAuthConfig(),
                params: {
                    ...(activeSession?._id ? { session: activeSession._id } : {}),
                    ...(selectedCampusId ? { campus: selectedCampusId } : {})
                }
            };

            const res = await axios.get(`${API_BASE}/Students/${schoolId}`, requestConfig);
            const students = Array.isArray(res.data) ? res.data : [];
            setAllStudentsList(students);
        } catch (err) {
            console.error('Failed to fetch students for sibling lookup', err);
        }
    }, [getSchoolId, getCampusId, selectedCampus, getAuthConfig, activeSession]);

    useEffect(() => {
        if (currentUser) {
            fetchStudentsForSiblingLookup();
        }
    }, [currentUser, fetchStudentsForSiblingLookup]);

    const getSiblingSections = (siblingClassValue) => {
        if (!siblingClassValue) return [];
        const matchedClass = classesList.find(
            (cls) => cls._id === siblingClassValue || cls.sclassName === siblingClassValue
        );
        return matchedClass?.sections || [];
    };

    const getFilteredSiblingStudents = (sibling, searchTermValue = '') => {
        const searchTerm = (searchTermValue || '').toLowerCase().trim();

        const filtered = allStudentsList.filter((student) => {
            const studentClassId = student?.sclassName?._id || student?.sclassName || '';
            const siblingClassFilter = sibling?.class || '';
            const classMatches = !siblingClassFilter || studentClassId === siblingClassFilter;
            const sectionMatches = !sibling?.section || student?.section === sibling.section;

            if (!classMatches || !sectionMatches) return false;
            if (!searchTerm) return true;

            const fullName = `${student?.firstName || ''} ${student?.lastName || ''}`.trim() || student?.name || '';
            const haystack = `${fullName} ${student?.admissionNum || ''} ${student?.rollNum || ''}`.toLowerCase();
            return haystack.includes(searchTerm);
        });

        return filtered.slice(0, 12);
    };

    const getSiblingStudentOptionLabel = (student) => {
        const fullName = `${student?.firstName || ''} ${student?.lastName || ''}`.trim() || student?.name || 'Unnamed';
        const className = student?.sclassName?.sclassName || '';
        const section = student?.section || '';
        const roll = student?.rollNum || '-';
        const admissionNo = student?.admissionNum || '-';
        return `${fullName} | ${className} ${section} | Roll ${roll} | Adm ${admissionNo}`;
    };

    const handleSiblingDraftClassChange = (value) => {
        setSiblingDraft((prev) => ({
            ...prev,
            class: value,
            section: '',
            siblingStudentId: '',
            name: '',
            rollNum: '',
            school: ''
        }));
        setSiblingSearchTerm('');
    };

    const handleSiblingDraftSectionChange = (value) => {
        setSiblingDraft((prev) => ({
            ...prev,
            section: value,
            siblingStudentId: '',
            name: '',
            rollNum: '',
            school: ''
        }));
        setSiblingSearchTerm('');
    };

    const handleSiblingDraftStudentSelect = (studentId) => {
        const selectedStudent = allStudentsList.find((student) => student._id === studentId);
        if (!selectedStudent) return;

        const fullName = `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() || selectedStudent.name || '';
        const studentClassId = selectedStudent?.sclassName?._id || selectedStudent?.sclassName || '';

        setSiblingDraft({
            siblingStudentId: selectedStudent._id,
            name: fullName,
            class: studentClassId,
            section: selectedStudent.section || '',
            rollNum: selectedStudent.rollNum || '',
            school: selectedStudent.school || ''
        });
        setSiblingSearchTerm(fullName);
    };

    const applyParentsFromSibling = (selectedStudent) => {
        setFormData((prev) => ({
            ...prev,
            father: selectedStudent?.father || prev.father,
            mother: selectedStudent?.mother || prev.mother,
            guardian: selectedStudent?.guardian || prev.guardian
        }));
        setIsParentAutoFilledFromSibling(true);

        if (selectedStudent?.guardian?.name) setGuardianType('other');
        else if (selectedStudent?.mother?.name && !selectedStudent?.father?.name) setGuardianType('mother');
        else if (selectedStudent?.father?.name) setGuardianType('father');
    };

    const handleAddSiblingFromDialog = () => {
        if (!siblingDraft.class) {
            toast.error('Please select sibling class.');
            return;
        }
        if (!siblingDraft.section) {
            toast.error('Please select sibling section.');
            return;
        }
        if (!siblingDraft.siblingStudentId) {
            toast.error('Please select a sibling student from list.');
            return;
        }

        const selectedStudent = allStudentsList.find((student) => student._id === siblingDraft.siblingStudentId);
        if (!selectedStudent) {
            toast.error('Selected sibling student is no longer available.');
            return;
        }

        const duplicateSibling = formData.siblings.some(
            (sib) => sib.siblingStudentId && sib.siblingStudentId === siblingDraft.siblingStudentId
        );
        if (duplicateSibling) {
            toast.error('This sibling is already added.');
            return;
        }

        setFormData((prev) => ({ ...prev, siblings: [...prev.siblings, siblingDraft] }));
        applyParentsFromSibling(selectedStudent);

        setIsSiblingDialogOpen(false);
        setSiblingDraft({
            name: '',
            class: '',
            section: '',
            rollNum: '',
            school: '',
            siblingStudentId: ''
        });
        setSiblingSearchTerm('');
        toast.success('Sibling added and parent details fetched.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic student fields validation
        if (!formData.firstName || !formData.rollNum || !formData.sclassName || !formData.section) {
            toast.error("Please fill in all required student identity fields mark with *");
            setLoading(false);
            return;
        }

        // Required Validations for Guardian
        if (guardianType === 'father' && !formData.father.name) {
            toast.error("Please enter Father's Name");
            setLoading(false);
            return;
        }
        if (guardianType === 'mother' && !formData.mother.name) {
            toast.error("Please enter Mother's Name");
            setLoading(false);
            return;
        }
        if (guardianType === 'other' && !formData.guardian.name) {
            toast.error("Please enter Guardian's Name");
            setLoading(false);
            return;
        }

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        
        try {
            const data = new FormData();
            
            const schoolId = getSchoolId();
            if (!schoolId) {
                toast.error("School information is missing. Please refresh and try again.");
                setLoading(false);
                return;
            }
            
            Object.keys(formData).forEach(key => {
                if (key === 'name' && !formData[key]) {
                     data.append('name', fullName);
                } else if (key === 'school') {
                    data.append('school', schoolId);
                } else if (key === 'campus') {
                    data.append('campus', formData.campus || getCampusId(selectedCampus) || '');
                } else if (key === 'session' && !formData[key]) {
                    // Skip optional session when not selected/available.
                } else if (['father', 'mother', 'guardian', 'transport', 'siblings'].includes(key)) {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (key === 'campus' && !formData[key]) {
                    // Skip
                } else {
                    data.append(key, formData[key] || '');
                }
            });

            Object.keys(photos).forEach(key => {
                if (photos[key]) data.append(key, photos[key]);
            });

            data.append('feeStructureIds', JSON.stringify(selectedFees));

            if (editStudentId) {
                // Ignore password if blank on edit
                if (!data.get('password')) { data.delete('password'); }
                const response = await axios.put(`${API_BASE}/Student/${editStudentId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Student updated successfully!");
            } else {
                const response = await axios.post(`${API_BASE}/StudentRegister`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Extract admission number from response
                const admissionNum = response.data?.student?.admissionNum;
                if (admissionNum) {
                    console.log(`✅ Student admitted with admission number: ${admissionNum}`);
                    toast.success(`Student admitted successfully!`);
                } else {
                    console.warn("⚠️ Admission number not found in response");
                    toast.success("Student admitted successfully!");
                }

                // 🔄 Refresh next admission number for the next student
                try {
                    await fetchNextAdmissionNum();
                    console.log(`✅ Refreshed next admission number after admission`);
                } catch (refreshErr) {
                    console.warn(`⚠️ Could not refresh next admission number:`, refreshErr.message);
                }
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("❌ Error during admission:", err);
            const errorMsg = err.response?.data?.message || (editStudentId ? "Error updating student" : "Error admitting student");
            console.error("Error details:", err.response?.data);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // --- Components ---

    // Photo Upload Component
    const PhotoUploader = ({ label, type, preview }) => (
        <div className="flex flex-col items-center gap-3 w-full relative">
            <Label className="text-muted-foreground font-medium">{label}</Label>
            <div className="relative group">
                <label
                    htmlFor={`file-${type}`}
                    className={`
                        relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 
                        border-2 border-dashed rounded-full cursor-pointer
                        transition-all overflow-hidden bg-muted/30
                        ${preview ? 'border-primary' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'}
                    `}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <User className="w-8 h-8 mb-1" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
                        </div>
                    )}

                    {preview && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                    )}
                    <input type="file" hidden id={`file-${type}`} onChange={(e) => handleFileChange(e, type)} accept="image/*" />
                </label>

                {preview && (
                    <button
                        type="button"
                        onClick={() => handleRemovePhoto(type)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in-50 duration-500">
            
            {/* 1. Student Identity (Photo & Basic) */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-indigo-600" />
                        <CardTitle>Student Identity</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Photo Column */}
                        <div className="w-full md:w-auto flex flex-col justify-center items-center md:items-start shrink-0 gap-4">
                            <PhotoUploader label="Student Photo" type="studentPhoto" preview={previews.studentPhoto || formData.studentPhotoUrl} />
                            <div className="w-full max-w-[160px] space-y-1 text-center md:text-left">
                                <Label htmlFor="studentPhotoUrl" className="text-xs text-muted-foreground">Or Image URL</Label>
                                <Input 
                                    id="studentPhotoUrl"
                                    name="studentPhotoUrl" 
                                    value={formData.studentPhotoUrl || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="https://..."
                                    className="text-xs h-8"
                                />
                            </div>
                        </div>

                        {/* Basic Info Column */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admissionNum">Admission No</Label>
                                <Input id="admissionNum" name="admissionNum" value={editStudentId ? formData.admissionNum : nextAdmissionNum} readOnly className="bg-muted font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rollNum">Roll Number <span className="text-destructive">*</span></Label>
                                <Input id="rollNum" name="rollNum" value={formData.rollNum} type="number" onChange={handleInputChange} required placeholder="e.g. 101" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sclassName">Class <span className="text-destructive">*</span></Label>
                                <Select value={formData.sclassName} onValueChange={(val) => handleSelectChange('sclassName', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classesList.map(cls => (
                                            <SelectItem key={cls._id} value={cls._id}>{cls.sclassName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="section">Section <span className="text-destructive">*</span></Label>
                                <Select value={formData.section} onValueChange={(val) => handleSelectChange('section', val)} required disabled={!formData.sclassName}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={formData.sclassName ? "Select Section" : "Select Class First"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectionsList.map(sec => (
                                            <SelectItem key={sec.sectionName || sec} value={sec.sectionName || sec}>
                                                {sec.sectionName || sec}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campus">Campus</Label>
                                <Select 
                                    value={formData.campus} 
                                    onValueChange={(val) => handleSelectChange('campus', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Campus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campuses && campuses.length > 0 ? (
                                            campuses.map(c => (
                                                <SelectItem key={c._id} value={c._id}>{c.campusName}</SelectItem>
                                            ))
                                        ) : null}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className=" flex items-end">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={addSibling}
                                    className=""
                                >
                                    <Plus className="h-4 w-4" /> Add Sibling
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Personal Information Detail */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                        <CardTitle>Personal Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="OBC">OBC</SelectItem>
                                    <SelectItem value="SC">SC</SelectItem>
                                    <SelectItem value="ST">ST</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <Input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="e.g. +1234567890" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="student@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admissionDate">Admission Date</Label>
                            <Input id="admissionDate" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="session">Academic Session</Label>
                            <Select value={formData.session} onValueChange={(val) => handleSelectChange('session', val)} disabled={!sessionsList || sessionsList.length === 0}>
                                <SelectTrigger className={!sessionsList || sessionsList.length === 0 ? "bg-muted cursor-not-allowed" : ""}>
                                    <SelectValue placeholder={sessionsList && sessionsList.length > 0 ? "Select Session" : "No sessions available"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessionsList && sessionsList.length > 0 && (
                                        sessionsList.map(sess => (
                                            <SelectItem key={sess._id} value={sess._id}>
                                                {getSessionLabel(sess)}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Blood Group</Label>
                            <Select value={formData.bloodGroup} onValueChange={(val) => handleSelectChange('bloodGroup', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Blood Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>House</Label>
                            <Select value={formData.house} onValueChange={(val) => handleSelectChange('house', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selct House" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Red', 'Green', 'Blue', 'Yellow'].map(h => (
                                        <SelectItem key={h} value={h}>{h}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g. 120cm or 4ft 5in" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 45kg" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="measurementDate">Measurement Date</Label>
                            <Input id="measurementDate" name="measurementDate" type="date" value={formData.measurementDate} onChange={handleInputChange} />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>Religion <span className="text-destructive">*</span></Label>
                            <RadioGroup value={formData.religion} onValueChange={(val) => handleSelectChange('religion', val)} className="flex flex-wrap gap-4">
                                {['Muslim', 'Christian', 'Hindu', 'Other'].map(rel => (
                                    <div className="flex items-center space-x-2" key={rel}>
                                        <RadioGroupItem value={rel} id={`r-${rel}`} />
                                        <Label htmlFor={`r-${rel}`} className="cursor-pointer font-normal text-muted-foreground">{rel}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label>Caste</Label>
                            <RadioGroup value={formData.caste} onValueChange={(val) => handleSelectChange('caste', val)} className="flex flex-wrap gap-4">
                                {['Arain', 'Ansari', 'Jutt', 'Comboh', 'Dogar', 'Rahmani', 'Malik', 'Rajpoot', 'Khokhar', 'Butt', 'Other'].map(cst => (
                                    <div className="flex items-center space-x-2" key={cst}>
                                        <RadioGroupItem value={cst} id={`c-${cst}`} />
                                        <Label htmlFor={`c-${cst}`} className="cursor-pointer font-normal text-muted-foreground">{cst}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Account Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-gray-600" />
                        <CardTitle>Login Credentials</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Set a password for the student to access the dashboard. Parents will also use this password for the Parent Portal.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PasswordField
                            label="Login Password"
                            id="password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            required={!editStudentId} // Not required on edit
                            placeholder={editStudentId ? "Leave blank to keep existing password" : "Set a strong password for login"}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 4. Parent/Guardian */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <CardTitle>Guardian Details</CardTitle>
                        {isParentAutoFilledFromSibling && (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                Auto-filled from sibling
                            </span>
                        )}
                    </div>

                    <div className="flex p-1 bg-muted rounded-lg">
                        {['father', 'mother', 'other'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setGuardianType(type)}
                                className={`
                                    px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize
                                    ${guardianType === type ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}
                                `}
                            >
                                {type === 'other' ? 'Guardian' : type}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        {guardianType === 'father' && (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="shrink-0 flex justify-center">
                                    <PhotoUploader label="Father's Photo" type="fatherPhoto" preview={previews.fatherPhoto} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    <div className="space-y-2">
                                        <Label>Father Name <span className="text-destructive">*</span></Label>
                                        <Input name="name" value={formData.father.name} onChange={(e) => handleInputChange(e, 'father')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" value={formData.father.phone} onChange={(e) => handleInputChange(e, 'father')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Occupation</Label>
                                        <Input name="occupation" value={formData.father.occupation} onChange={(e) => handleInputChange(e, 'father')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" value={formData.father.email} onChange={(e) => handleInputChange(e, 'father')} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Address</Label>
                                        <Textarea name="address" value={formData.father.address} onChange={(e) => handleInputChange(e, 'father')} rows={2} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {guardianType === 'mother' && (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="shrink-0 flex justify-center">
                                    <PhotoUploader label="Mother's Photo" type="motherPhoto" preview={previews.motherPhoto} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    <div className="space-y-2">
                                        <Label>Mother Name <span className="text-destructive">*</span></Label>
                                        <Input name="name" value={formData.mother.name} onChange={(e) => handleInputChange(e, 'mother')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" value={formData.mother.phone} onChange={(e) => handleInputChange(e, 'mother')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Occupation</Label>
                                        <Input name="occupation" value={formData.mother.occupation} onChange={(e) => handleInputChange(e, 'mother')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" value={formData.mother.email} onChange={(e) => handleInputChange(e, 'mother')} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Address</Label>
                                        <Textarea name="address" value={formData.mother.address} onChange={(e) => handleInputChange(e, 'mother')} rows={2} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {guardianType === 'other' && (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="shrink-0 flex justify-center">
                                    <PhotoUploader label="Guardian's Photo" type="guardianPhoto" preview={previews.guardianPhoto} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    <div className="space-y-2">
                                        <Label>Guardian Name <span className="text-destructive">*</span></Label>
                                        <Input name="name" value={formData.guardian.name} onChange={(e) => handleInputChange(e, 'guardian')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Relation <span className="text-destructive">*</span></Label>
                                        <Input name="relation" value={formData.guardian.relation} onChange={(e) => handleInputChange(e, 'guardian')} required placeholder="e.g. Uncle" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" value={formData.guardian.phone} onChange={(e) => handleInputChange(e, 'guardian')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Occupation</Label>
                                        <Input name="occupation" value={formData.guardian.occupation} onChange={(e) => handleInputChange(e, 'guardian')} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Address</Label>
                                        <Textarea name="address" value={formData.guardian.address} onChange={(e) => handleInputChange(e, 'guardian')} rows={2} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 5. Transport */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bus className="h-5 w-5 text-orange-600" />
                        <CardTitle>Transport</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Route</Label>
                            <Select value={formData.transport.route} onValueChange={(val) => handleSelectChange('route', val, 'transport')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Route" />
                                </SelectTrigger>
                                <SelectContent>
                                    {routesList.map(route => (
                                        <SelectItem key={route._id} value={route._id}>{route.routeTitle}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Pickup Point</Label>
                            <Select value={formData.transport.pickupPoint} onValueChange={(val) => handleSelectChange('pickupPoint', val, 'transport')} disabled={!formData.transport.route || transportLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={transportLoading ? "Loading..." : (formData.transport.route ? "Select Pickup Point" : "Select Route First")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {pickupPointsList.map(stop => (
                                        <SelectItem key={stop._id} value={stop.pickupPoint?.pickupPointName || stop.pickupPointName}>
                                            {stop.pickupPoint?.pickupPointName || stop.pickupPointName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fees Month</Label>
                            <Select value={formData.transport.feesMonth} onValueChange={(val) => handleSelectChange('feesMonth', val, 'transport')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 6. Fee Assignment */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <CardTitle>Fee Assignment {editStudentId && "(Disabled during edit)"}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select fee structures to assign to this student upon admission.
                    </p>
                </CardHeader>
                <CardContent>
                    {editStudentId ? (
                        <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
                            <p className="text-muted-foreground text-sm">Fee assignment is done during new admission. To manage fees for existing students, please use the Fee Collection module.</p>
                        </div>
                    ) : feeStructuresList.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
                            <p className="text-muted-foreground text-sm">No active fee structures found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feeStructuresList.map((fee) => (
                                    <label
                                        key={fee._id}
                                        htmlFor={`fee-${fee._id}`}
                                        className={`
                                            flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50
                                            ${selectedFees.includes(fee._id) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-background'}
                                        `}
                                    >
                                        <Checkbox
                                            id={`fee-${fee._id}`}
                                            checked={selectedFees.includes(fee._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFees(prev => [...prev, fee._id]);
                                                } else {
                                                    setSelectedFees(prev => prev.filter(id => id !== fee._id));
                                                }
                                            }}
                                        />
                                        <div className="grid gap-0.5 leading-none">
                                            <span className="text-sm font-medium leading-none">
                                                {fee.feeName}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                {fee.feeType} - {currentUser?.currency || 'PKR'} {fee.amount}
                                            </p>
                                        </div>
                                    </label>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 7. Siblings */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-cyan-600" />
                        <CardTitle>Sibling Information</CardTitle>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSibling}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Sibling
                    </Button>
                </CardHeader>
                <CardContent>
                    {formData.siblings.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground text-sm">No siblings added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.siblings.map((sibling, index) => (
                                <div key={index} className="bg-muted/30 p-4 rounded-lg border relative group">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeSibling(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm pr-10">
                                        <div>
                                            <p className="text-muted-foreground">Name</p>
                                            <p className="font-medium">{sibling.name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Class</p>
                                            <p className="font-medium">
                                                {classesList.find((cls) => cls._id === sibling.class)?.sclassName || sibling.class || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Section</p>
                                            <p className="font-medium">{sibling.section || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Roll No</p>
                                            <p className="font-medium">{sibling.rollNum || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isSiblingDialogOpen} onOpenChange={setIsSiblingDialogOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add Sibling</DialogTitle>
                        <DialogDescription>
                            Select class, then section, then choose student from searchable list.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={siblingDraft.class} onValueChange={handleSiblingDraftClassChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classesList.map((cls) => (
                                        <SelectItem key={cls._id} value={cls._id}>{cls.sclassName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Section</Label>
                            <Select
                                value={siblingDraft.section}
                                onValueChange={handleSiblingDraftSectionChange}
                                disabled={!siblingDraft.class}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={siblingDraft.class ? 'Select Section' : 'Select Class First'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {getSiblingSections(siblingDraft.class).map((sec) => {
                                        const sectionName = sec.sectionName || sec;
                                        return (
                                            <SelectItem key={sectionName} value={sectionName}>
                                                {sectionName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Student Search</Label>
                        <Input
                            value={siblingSearchTerm}
                            onChange={(e) => setSiblingSearchTerm(e.target.value)}
                            placeholder="Search by name, admission no, or roll no"
                            disabled={!siblingDraft.class || !siblingDraft.section}
                        />
                        <div className="mt-2 border rounded-md bg-background max-h-56 overflow-auto">
                            {getFilteredSiblingStudents(siblingDraft, siblingSearchTerm).length === 0 ? (
                                <p className="text-xs text-muted-foreground px-3 py-2">No matching students found.</p>
                            ) : (
                                    getFilteredSiblingStudents(siblingDraft, siblingSearchTerm).map((student) => (
                                        <button
                                            key={student._id}
                                            type="button"
                                            className={`w-full text-left px-3 py-2 text-sm border-b last:border-b-0 hover:bg-muted/60 ${siblingDraft.siblingStudentId === student._id ? 'bg-primary/10' : ''}`}
                                            onClick={() => handleSiblingDraftStudentSelect(student._id)}
                                        >
                                            {getSiblingStudentOptionLabel(student)}
                                        </button>
                                    ))
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsSiblingDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleAddSiblingFromDialog}>
                            Add Sibling
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" size="lg" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size="lg" disabled={loading} className="min-w-[150px]">
                    {loading ? "Processing..." : (
                        <>
                            <Save className="h-4 w-4 mr-2" /> {editStudentId ? "Update Student" : "Admit Student"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default StudentAdmissionForm;