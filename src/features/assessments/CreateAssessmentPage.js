import React,
{
    useState
}
from 'react';
import {
    useNavigate
}
from 'react-router-dom';
import './CreateAssessmentPage.css';

export default function CreateAssessmentPage() {
    const [jobId,
        setJobId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jobId) {
            navigate(`/assessments/${jobId.trim()}`);
        }
    };

    return (
         <div className = "create-assessment-container" >
        <div className = "create-assessment-box" >
        <h2 > Create or Edit an Assessment </h2> 
        <p> Enter the Job ID you want to build an assessment
        for. </p> <
        form onSubmit = {
            handleSubmit
        } >
        <input type = "text"
        value = {jobId}
        onChange = { (e) => setJobId(e.target.value)}
        placeholder = "e.g., job-1, job-2, etc." />
         <button type = "submit" className = "create-job-btn" > Go to Builder→ </button> 
         </form> 
         </div>
         </div>
    );
}