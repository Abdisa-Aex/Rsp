// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "../../../context/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   GraduationCap,
//   BookOpen,
//   Wrench,
//   Laptop,
//   Trophy,
//   Microscope,
//   Calculator,
//   Palette,
//   Camera,
//   Music,
//   Gamepad2,
//   Bike,
//   Car,
//   DollarSign,
//   Package,
//   Heart,
//   Shield,
//   Users,
//   Globe,
//   Award,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   ArrowRight,
//   Mail,
//   Phone,
//   MapPin,
//   User,
//   Key,
//   School,
//   Loader2,
//   X,
//   Eye as EyeIcon,
//   EyeOff as EyeSlashIcon,
//   Gift,
//   Save,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import Header from "../../../components/layout/Header";
// import Footer from "../../../components/layout/Footer";
// import AnnouncementBar from "../../../components/layout/AnnouncementBar";

// // ==================== VALIDATION FUNCTIONS ====================

// // Email validation
// const validateEmail = (email) => {
//   if (!email) return "Email is required";
//   if (!email.includes("@")) return "Please enter a valid email address";
//   if (email.length < 5) return "Email is too short";
//   return null;
// };

// // Password validation (minimum 6 characters)
// const validatePassword = (password) => {
//   if (!password) return "Password is required";
//   if (password.length < 6) return "Password must be at least 6 characters";
//   return null;
// };

// // Confirm password validation
// const validateConfirmPassword = (password, confirmPassword) => {
//   if (!confirmPassword) return "Please confirm your password";
//   if (password !== confirmPassword) return "Passwords do not match";
//   return null;
// };

// // Full name validation
// const validateFullName = (name) => {
//   if (!name) return "Full name is required";
//   if (name.length < 2) return "Name must be at least 2 characters";
//   if (name.length > 50) return "Name is too long";
//   return null;
// };

// // Student ID validation: r/XXXX/XX format
// const validateStudentId = (id) => {
//   if (!id) return "Student ID is required";
//   const regex = /^[rR]\/\d{4}\/\d{2}$/;
//   if (!regex.test(id)) return "Format: r/XXXX/XX (e.g., r/0074/13)";
//   return null;
// };

// // Phone validation (Ethiopian format)
// const validatePhone = (phone) => {
//   if (!phone) return null; // Optional for external users
//   const cleaned = phone.replace(/\s/g, "");
//   const regex = /^(\+251|0)[9]\d{8}$/;
//   if (!regex.test(cleaned)) return "Format: +251XXXXXXXXX or 09XXXXXXXX";
//   return null;
// };

// // Department validation
// const validateDepartment = (dept) => {
//   if (!dept) return "Department is required";
//   return null;
// };

// // Year of study validation
// const validateYearOfStudy = (year) => {
//   if (!year) return "Year of study is required";
//   return null;
// };

// // Graduation year validation
// const validateGraduationYear = (year) => {
//   if (!year) return "Graduation year is required";
//   const currentYear = new Date().getFullYear();
//   const yearNum = parseInt(year);
//   if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear + 10) {
//     return "Please enter a valid year";
//   }
//   return null;
// };

// // ==================== COMPONENT ====================

// const departments = [
//   "Computer Science",
//   "Information Technology",
//   "Software Engineering",
//   "Electrical Engineering",
//   "Mechanical Engineering",
//   "Civil Engineering",
//   "Chemical Engineering",
//   "Architecture",
//   "Business Administration",
//   "Accounting",
//   "Economics",
//   "Law",
//   "Medicine",
//   "Pharmacy",
//   "Nursing",
//   "Public Health",
//   "Agriculture",
//   "Veterinary Medicine",
//   "Education",
//   "Language Studies",
//   "Journalism",
//   "Fine Arts",
//   "Music",
//   "Sports Science",
// ];

// const steps = [
//   {
//     number: 1,
//     title: "Account",
//     icon: "User",
//     description: "Create your account",
//   },
//   {
//     number: 2,
//     title: "University",
//     icon: "GraduationCap",
//     description: "Verify your affiliation",
//   },
//   {
//     number: 3,
//     title: "Contact",
//     icon: "Phone",
//     description: "How to reach you",
//   },
//   {
//     number: 4,
//     title: "Preferences",
//     icon: "Heart",
//     description: "What you want to share",
//   },
// ];

// // Map icon names to components
// const getIconComponent = (iconName) => {
//   switch (iconName) {
//     case "User":
//       return User;
//     case "GraduationCap":
//       return GraduationCap;
//     case "Phone":
//       return Phone;
//     case "Heart":
//       return Heart;
//     default:
//       return User;
//   }
// };

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const referralCode = searchParams.get("ref");
//   const { register, resendVerification, checkEmailAvailability } = useAuth();

//   // Form state
//   const [step, setStep] = useState(1);
//   const [stepTransition, setStepTransition] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "external",
//     studentId: "",
//     department: "",
//     yearOfStudy: "",
//     faculty: "",
//     graduationYear: "",
//     phone: "",
//     campusAddress: "",
//     roomNumber: "",
//     resourceCategories: [],
//     sharingPurpose: [],
//     availability: "flexible",
//     agreeTerms: false,
//     agreeSharingPolicy: false,
//     referralCode: referralCode || "",
//   });

//   // UI state
//   const [showVerification, setShowVerification] = useState(false);
//   const [verificationEmail, setVerificationEmail] = useState("");
//   const [verificationLoading, setVerificationLoading] = useState(false);
//   const [verificationError, setVerificationError] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [emailAvailable, setEmailAvailable] = useState(null);
//   const [checkingEmail, setCheckingEmail] = useState(false);
//   const [draftSaved, setDraftSaved] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fullNameInputRef = useRef(null);
//   const errorRef = useRef(null);
//   const draftTimerRef = useRef(null);

//   // ==================== VALIDATION FUNCTION ====================
//   const validateStep = () => {
//     const errors = {};

//     if (step === 1) {
//       const nameError = validateFullName(formData.fullName);
//       if (nameError) errors.fullName = nameError;

//       const emailError = validateEmail(formData.email);
//       if (emailError) errors.email = emailError;
//       else if (emailAvailable === false)
//         errors.email = "Email already registered";

//       const passwordError = validatePassword(formData.password);
//       if (passwordError) errors.password = passwordError;

//       const confirmError = validateConfirmPassword(
//         formData.password,
//         formData.confirmPassword,
//       );
//       if (confirmError) errors.confirmPassword = confirmError;
//     }

//     if (step === 2) {
//       if (formData.userType === "student") {
//         const studentIdError = validateStudentId(formData.studentId);
//         if (studentIdError) errors.studentId = studentIdError;

//         const deptError = validateDepartment(formData.department);
//         if (deptError) errors.department = deptError;

//         const yearError = validateYearOfStudy(formData.yearOfStudy);
//         if (yearError) errors.yearOfStudy = yearError;
//       }

//       if (formData.userType === "faculty") {
//         const deptError = validateDepartment(formData.department);
//         if (deptError) errors.department = deptError;
//       }

//       if (formData.userType === "alumni") {
//         const deptError = validateDepartment(formData.department);
//         if (deptError) errors.department = deptError;

//         const gradError = validateGraduationYear(formData.graduationYear);
//         if (gradError) errors.graduationYear = gradError;
//       }
//     }

//     if (step === 3) {
//       if (formData.userType !== "external") {
//         const phoneError = validatePhone(formData.phone);
//         if (phoneError) errors.phone = phoneError;
//       }
//     }

//     if (step === 4) {
//       if (!formData.agreeTerms)
//         errors.agreeTerms = "You must agree to the Terms of Service";
//       if (!formData.agreeSharingPolicy)
//         errors.agreeSharingPolicy = "You must agree to the Sharing Policy";
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ==================== FIELD HANDLERS ====================
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (touched[field]) {
//       validateStep();
//     }
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     validateStep();
//   };

//   // ==================== EMAIL AVAILABILITY CHECK ====================
//   useEffect(() => {
//     const checkEmail = async () => {
//       if (
//         !formData.email ||
//         formData.email.length < 5 ||
//         !formData.email.includes("@")
//       ) {
//         setEmailAvailable(null);
//         return;
//       }
//       setCheckingEmail(true);
//       const res = await checkEmailAvailability(formData.email);
//       setEmailAvailable(res.available);
//       setCheckingEmail(false);

//       if (!res.available && touched.email) {
//         setFieldErrors((prev) => ({
//           ...prev,
//           email: "Email already registered",
//         }));
//       } else {
//         setFieldErrors((prev) => {
//           const newErr = { ...prev };
//           delete newErr.email;
//           return newErr;
//         });
//       }
//     };

//     const timer = setTimeout(checkEmail, 500);
//     return () => clearTimeout(timer);
//   }, [formData.email, touched.email, checkEmailAvailability]);

//   // ==================== AUTO-SAVE DRAFT ====================
//   useEffect(() => {
//     if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
//     draftTimerRef.current = setTimeout(() => {
//       localStorage.setItem("register_draft", JSON.stringify(formData));
//       setDraftSaved(true);
//       setTimeout(() => setDraftSaved(false), 3000);
//     }, 3000);
//     return () => clearTimeout(draftTimerRef.current);
//   }, [formData]);

//   // ==================== LOAD SAVED DRAFT ====================
//   useEffect(() => {
//     const saved = localStorage.getItem("register_draft");
//     if (
//       saved &&
//       confirm("You have a saved draft. Would you like to continue?")
//     ) {
//       setFormData(JSON.parse(saved));
//     }
//     fullNameInputRef.current?.focus();
//   }, []);

//   // ==================== STEP NAVIGATION ====================
//   const handleNext = () => {
//     if (validateStep()) {
//       setStepTransition(true);
//       setTimeout(() => {
//         setStep((prev) => prev + 1);
//         setStepTransition(false);
//         setError("");
//       }, 300);
//     } else {
//       setError("Please fix the errors before continuing");
//       // Scroll to first error
//       const firstErrorField = Object.keys(fieldErrors)[0];
//       if (firstErrorField) {
//         const element = document.getElementById(firstErrorField);
//         element?.scrollIntoView({ behavior: "smooth", block: "center" });
//         element?.focus();
//       }
//     }
//   };

//   const handleBack = () => {
//     setStepTransition(true);
//     setTimeout(() => {
//       setStep((prev) => prev - 1);
//       setStepTransition(false);
//       setError("");
//     }, 300);
//   };

//   // ==================== REGISTRATION SUBMIT ====================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateStep()) {
//       setError("Please fix all errors before submitting");
//       const firstErrorField = Object.keys(fieldErrors)[0];
//       if (firstErrorField) {
//         document
//           .getElementById(firstErrorField)
//           ?.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//       return;
//     }

//     setIsSubmitting(true);
//     setError("");

//     const cleanData = { ...formData };

//     // Clean data based on user type
//     if (cleanData.userType !== "student") {
//       delete cleanData.studentId;
//       delete cleanData.department;
//       delete cleanData.yearOfStudy;
//       delete cleanData.faculty;
//       delete cleanData.graduationYear;
//     } else {
//       if (!cleanData.studentId) delete cleanData.studentId;
//       if (!cleanData.department) delete cleanData.department;
//       if (!cleanData.yearOfStudy) delete cleanData.yearOfStudy;
//     }

//     if (cleanData.userType !== "external") {
//       if (!cleanData.phone) delete cleanData.phone;
//     }

//     if (!cleanData.campusAddress) delete cleanData.campusAddress;
//     if (!cleanData.roomNumber) delete cleanData.roomNumber;
//     if (!cleanData.resourceCategories?.length)
//       delete cleanData.resourceCategories;
//     if (!cleanData.sharingPurpose?.length) delete cleanData.sharingPurpose;

//     const result = await register(cleanData);

//     if (result.success) {
//       setVerificationEmail(formData.email);
//       setShowVerification(true);
//       setSuccess(
//         "Registration successful! Check your email for the magic link.",
//       );

//       // Start countdown for resend
//       setResendCountdown(60);
//       const timer = setInterval(() => {
//         setResendCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       localStorage.removeItem("register_draft");
//     } else {
//       setError(result.error || "Registration failed. Please try again.");
//     }

//     setIsSubmitting(false);
//   };

//   // ==================== RESEND VERIFICATION ====================
//   const handleResendVerification = async () => {
//     if (resendCountdown > 0) return;

//     setResendCountdown(60);
//     const timer = setInterval(() => {
//       setResendCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     await resendVerification(verificationEmail);
//     setSuccess("New magic link sent! Check your email.");
//     setTimeout(() => setSuccess(""), 3000);
//   };

//   // ==================== CHECK STEP COMPLETION ====================
//   const isStepComplete = (stepNum) => {
//     if (stepNum === 1) {
//       return (
//         formData.fullName &&
//         formData.email &&
//         emailAvailable !== false &&
//         formData.password &&
//         formData.password === formData.confirmPassword &&
//         formData.password.length >= 6
//       );
//     }
//     if (stepNum === 2) {
//       if (formData.userType === "student") {
//         return (
//           formData.studentId &&
//           validateStudentId(formData.studentId) === null &&
//           formData.department &&
//           formData.yearOfStudy
//         );
//       }
//       if (formData.userType === "faculty") {
//         return formData.department;
//       }
//       if (formData.userType === "alumni") {
//         return formData.department && formData.graduationYear;
//       }
//       return true;
//     }
//     if (stepNum === 3) {
//       if (formData.userType !== "external") {
//         return formData.phone && validatePhone(formData.phone) === null;
//       }
//       return true;
//     }
//     if (stepNum === 4) {
//       return formData.agreeTerms && formData.agreeSharingPolicy;
//     }
//     return false;
//   };

//   // ==================== RENDER ERROR MESSAGE ====================
//   const renderError = (field) => {
//     if (fieldErrors[field] && touched[field]) {
//       return (
//         <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//           <AlertCircle className="h-3 w-3" />
//           {fieldErrors[field]}
//         </p>
//       );
//     }
//     return null;
//   };

//   // ==================== JSX ====================
//   return (
//     <>
//       <AnnouncementBar />
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <GraduationCap className="h-8 w-8 text-white" />
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">
//               Jigjiga University
//             </h1>
//             <p className="text-xl text-gray-600">
//               Resource Sharing & Exchange Platform
//             </p>
//           </div>

//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-2">
//               {steps.map((s) => {
//                 const IconComponent = getIconComponent(s.icon);
//                 return (
//                   <div key={s.number} className="flex items-center">
//                     <button
//                       onClick={() => {
//                         if (isStepComplete(s.number - 1) && s.number < step) {
//                           setStep(s.number);
//                         }
//                       }}
//                       disabled={
//                         !isStepComplete(s.number - 1) && s.number < step
//                       }
//                       className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
//                         step >= s.number
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-200 text-gray-500"
//                       } ${
//                         isStepComplete(s.number) && step !== s.number
//                           ? "ring-2 ring-green-500 ring-offset-2"
//                           : ""
//                       }`}
//                     >
//                       {step > s.number ||
//                       (isStepComplete(s.number) && step !== s.number)
//                         ? "✓"
//                         : s.number}
//                     </button>
//                     {s.number < steps.length && (
//                       <div
//                         className={`w-16 h-1 mx-2 transition-all ${
//                           step > s.number ||
//                           (isStepComplete(s.number) && step > s.number)
//                             ? "bg-blue-600"
//                             : "bg-gray-200"
//                         }`}
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="flex justify-between text-sm text-gray-600 px-2">
//               {steps.map((s) => (
//                 <span key={s.number}>
//                   {s.title} {isStepComplete(s.number) && "✓"}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Main Form Card */}
//           <div
//             className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
//               stepTransition ? "opacity-50 scale-95" : "opacity-100 scale-100"
//             }`}
//           >
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/20 rounded-lg">
//                   {(() => {
//                     const IconComponent = getIconComponent(
//                       steps[step - 1].icon,
//                     );
//                     return <IconComponent className="h-5 w-5 text-white" />;
//                   })()}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">
//                     {steps[step - 1].title}
//                   </h2>
//                   <p className="text-blue-100 mt-1">
//                     {steps[step - 1].description}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <div
//                 ref={errorRef}
//                 className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             )}

//             {/* Success Alert */}
//             {success && (
//               <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
//                 <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-green-700">{success}</p>
//               </div>
//             )}

//             {/* Draft Saved Toast */}
//             {draftSaved && (
//               <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2 z-50">
//                 <Save className="h-4 w-4" />
//                 <span>Draft saved</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               {/* Step 1: Account Information */}
//               {step === 1 && (
//                 <div className="space-y-5">
//                   {/* User Type Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       I am a
//                     </label>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {["student", "faculty", "alumni", "external"].map(
//                         (type) => (
//                           <button
//                             key={type}
//                             type="button"
//                             onClick={() => handleChange("userType", type)}
//                             className={`p-4 border-2 rounded-xl text-left transition-all ${
//                               formData.userType === type
//                                 ? "border-blue-600 bg-blue-50"
//                                 : "border-gray-200 hover:border-blue-300"
//                             }`}
//                           >
//                             <div className="text-2xl mb-2">
//                               {type === "student" && "🎓"}
//                               {type === "faculty" && "👨‍🏫"}
//                               {type === "alumni" && "🌟"}
//                               {type === "external" && "🤝"}
//                             </div>
//                             <div className="font-medium text-gray-900">
//                               {type.charAt(0).toUpperCase() + type.slice(1)}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                               {type === "student" && "Current student"}
//                               {type === "faculty" && "Staff member"}
//                               {type === "alumni" && "Graduate"}
//                               {type === "external" && "Community partner"}
//                             </div>
//                           </button>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   {/* Full Name */}
//                   <div>
//                     <label
//                       htmlFor="fullName"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="fullName"
//                         ref={fullNameInputRef}
//                         type="text"
//                         autoComplete="name"
//                         value={formData.fullName}
//                         onChange={(e) =>
//                           handleChange("fullName", e.target.value)
//                         }
//                         onBlur={() => handleBlur("fullName")}
//                         className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           fieldErrors.fullName && touched.fullName
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                     {renderError("fullName")}
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Email Address <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="email"
//                         type="email"
//                         autoComplete="email"
//                         value={formData.email}
//                         onChange={(e) => handleChange("email", e.target.value)}
//                         onBlur={() => handleBlur("email")}
//                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           fieldErrors.email && touched.email
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="you@example.com"
//                       />
//                       {checkingEmail && (
//                         <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
//                       )}
//                       {emailAvailable === true &&
//                         formData.email &&
//                         !checkingEmail && (
//                           <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
//                         )}
//                     </div>
//                     {renderError("email")}
//                     {emailAvailable === true &&
//                       !fieldErrors.email &&
//                       formData.email && (
//                         <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
//                           <CheckCircle className="h-3 w-3" />
//                           Email is available
//                         </p>
//                       )}
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label
//                       htmlFor="password"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Password <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         autoComplete="new-password"
//                         value={formData.password}
//                         onChange={(e) =>
//                           handleChange("password", e.target.value)
//                         }
//                         onBlur={() => handleBlur("password")}
//                         className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           fieldErrors.password && touched.password
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="At least 6 characters"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       >
//                         {showPassword ? (
//                           <EyeSlashIcon className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <EyeIcon className="h-5 w-5 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                     {renderError("password")}
//                     {formData.password && !fieldErrors.password && (
//                       <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3" />
//                         Password is valid
//                       </p>
//                     )}
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label
//                       htmlFor="confirmPassword"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Confirm Password <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? "text" : "password"}
//                         autoComplete="new-password"
//                         value={formData.confirmPassword}
//                         onChange={(e) =>
//                           handleChange("confirmPassword", e.target.value)
//                         }
//                         onBlur={() => handleBlur("confirmPassword")}
//                         className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           fieldErrors.confirmPassword && touched.confirmPassword
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="Re-enter your password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeSlashIcon className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <EyeIcon className="h-5 w-5 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                     {renderError("confirmPassword")}
//                     {formData.confirmPassword &&
//                       !fieldErrors.confirmPassword &&
//                       formData.password === formData.confirmPassword && (
//                         <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
//                           <CheckCircle className="h-3 w-3" />
//                           Passwords match
//                         </p>
//                       )}
//                   </div>

//                   {/* Referral Code Display */}
//                   {referralCode && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Referral Code
//                       </label>
//                       <div className="relative">
//                         <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         <input
//                           type="text"
//                           value={formData.referralCode}
//                           readOnly
//                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
//                         />
//                       </div>
//                       <p className="mt-1 text-sm text-green-600">
//                         You'll receive bonus points for using a referral code!
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 2: University Information */}
//               {step === 2 && (
//                 <div className="space-y-5">
//                   {formData.userType === "student" && (
//                     <>
//                       <div>
//                         <label
//                           htmlFor="studentId"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Student ID <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                           <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                           <input
//                             id="studentId"
//                             type="text"
//                             autoComplete="off"
//                             value={formData.studentId}
//                             onChange={(e) =>
//                               handleChange("studentId", e.target.value)
//                             }
//                             onBlur={() => handleBlur("studentId")}
//                             className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                               fieldErrors.studentId && touched.studentId
//                                 ? "border-red-500 bg-red-50"
//                                 : "border-gray-300"
//                             }`}
//                             placeholder="r/0074/13"
//                           />
//                           {validateStudentId(formData.studentId) === null &&
//                             formData.studentId && (
//                               <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
//                             )}
//                         </div>
//                         {renderError("studentId")}
//                         <p className="mt-1 text-sm text-gray-500">
//                           Format: r/XXXX/XX (e.g., r/0074/13)
//                         </p>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="department"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Department <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           id="department"
//                           value={formData.department}
//                           onChange={(e) =>
//                             handleChange("department", e.target.value)
//                           }
//                           onBlur={() => handleBlur("department")}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             fieldErrors.department && touched.department
//                               ? "border-red-500 bg-red-50"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           <option value="">Select your department</option>
//                           {departments.map((d) => (
//                             <option key={d} value={d}>
//                               {d}
//                             </option>
//                           ))}
//                         </select>
//                         {renderError("department")}
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="yearOfStudy"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Year of Study <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           id="yearOfStudy"
//                           value={formData.yearOfStudy}
//                           onChange={(e) =>
//                             handleChange("yearOfStudy", e.target.value)
//                           }
//                           onBlur={() => handleBlur("yearOfStudy")}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             fieldErrors.yearOfStudy && touched.yearOfStudy
//                               ? "border-red-500 bg-red-50"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           <option value="">Select year</option>
//                           <option value="1">1st Year</option>
//                           <option value="2">2nd Year</option>
//                           <option value="3">3rd Year</option>
//                           <option value="4">4th Year</option>
//                           <option value="5">5th Year</option>
//                           <option value="graduate">Graduate Student</option>
//                         </select>
//                         {renderError("yearOfStudy")}
//                       </div>
//                     </>
//                   )}

//                   {formData.userType === "faculty" && (
//                     <>
//                       <div>
//                         <label
//                           htmlFor="facultyDepartment"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Department <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           id="facultyDepartment"
//                           value={formData.department}
//                           onChange={(e) =>
//                             handleChange("department", e.target.value)
//                           }
//                           onBlur={() => handleBlur("department")}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             fieldErrors.department && touched.department
//                               ? "border-red-500 bg-red-50"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           <option value="">Select your department</option>
//                           {departments.map((d) => (
//                             <option key={d} value={d}>
//                               {d}
//                             </option>
//                           ))}
//                         </select>
//                         {renderError("department")}
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="faculty"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Faculty/Position
//                         </label>
//                         <input
//                           id="faculty"
//                           type="text"
//                           autoComplete="organization-title"
//                           value={formData.faculty}
//                           onChange={(e) =>
//                             handleChange("faculty", e.target.value)
//                           }
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="e.g., Professor, Lecturer, Researcher"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {formData.userType === "alumni" && (
//                     <>
//                       <div>
//                         <label
//                           htmlFor="alumniDepartment"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Department <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           id="alumniDepartment"
//                           value={formData.department}
//                           onChange={(e) =>
//                             handleChange("department", e.target.value)
//                           }
//                           onBlur={() => handleBlur("department")}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             fieldErrors.department && touched.department
//                               ? "border-red-500 bg-red-50"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           <option value="">Select your department</option>
//                           {departments.map((d) => (
//                             <option key={d} value={d}>
//                               {d}
//                             </option>
//                           ))}
//                         </select>
//                         {renderError("department")}
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="graduationYear"
//                           className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                           Graduation Year{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           id="graduationYear"
//                           type="text"
//                           autoComplete="off"
//                           value={formData.graduationYear}
//                           onChange={(e) =>
//                             handleChange("graduationYear", e.target.value)
//                           }
//                           onBlur={() => handleBlur("graduationYear")}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             fieldErrors.graduationYear && touched.graduationYear
//                               ? "border-red-500 bg-red-50"
//                               : "border-gray-300"
//                           }`}
//                           placeholder="e.g., 2020"
//                         />
//                         {renderError("graduationYear")}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* Step 3: Contact Information */}
//               {step === 3 && (
//                 <div className="space-y-5">
//                   <div>
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Phone Number{" "}
//                       {formData.userType !== "external" && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="phone"
//                         type="tel"
//                         autoComplete="tel"
//                         value={formData.phone}
//                         onChange={(e) => handleChange("phone", e.target.value)}
//                         onBlur={() => handleBlur("phone")}
//                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           fieldErrors.phone && touched.phone
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="+251 91X XXX XXX or 09XX XXX XXX"
//                       />
//                       {validatePhone(formData.phone) === null &&
//                         formData.phone && (
//                           <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
//                         )}
//                     </div>
//                     {renderError("phone")}
//                     <p className="mt-1 text-sm text-gray-500">
//                       Format: +251XXXXXXXXX or 09XXXXXXXX
//                     </p>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="campusAddress"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Campus Address (Optional)
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         id="campusAddress"
//                         type="text"
//                         autoComplete="street-address"
//                         value={formData.campusAddress}
//                         onChange={(e) =>
//                           handleChange("campusAddress", e.target.value)
//                         }
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="e.g., Main Campus, Block A"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="roomNumber"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Room/Dorm Number (Optional)
//                     </label>
//                     <input
//                       id="roomNumber"
//                       type="text"
//                       autoComplete="off"
//                       value={formData.roomNumber}
//                       onChange={(e) =>
//                         handleChange("roomNumber", e.target.value)
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="e.g., Room 203, Dorm B"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="availability"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Availability for Sharing
//                     </label>
//                     <select
//                       id="availability"
//                       value={formData.availability}
//                       onChange={(e) =>
//                         handleChange("availability", e.target.value)
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="flexible">Flexible (Any time)</option>
//                       <option value="weekdays">Weekdays (Mon-Fri)</option>
//                       <option value="weekends">Weekends (Sat-Sun)</option>
//                       <option value="evenings">Evenings (After 5 PM)</option>
//                       <option value="mornings">Mornings (Before 12 PM)</option>
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {/* Step 4: Preferences & Agreement */}
//               {step === 4 && (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       What do you want to do?
//                     </label>
//                     <div className="grid grid-cols-2 gap-3">
//                       {["share", "sell", "borrow", "exchange"].map((p) => {
//                         const icons = {
//                           share: Heart,
//                           sell: DollarSign,
//                           borrow: Package,
//                           exchange: ArrowRight,
//                         };
//                         const Icon = icons[p];
//                         const selected = formData.sharingPurpose.includes(p);
//                         return (
//                           <button
//                             key={p}
//                             type="button"
//                             onClick={() => {
//                               const newPurposes = selected
//                                 ? formData.sharingPurpose.filter((x) => x !== p)
//                                 : [...formData.sharingPurpose, p];
//                               handleChange("sharingPurpose", newPurposes);
//                             }}
//                             className={`p-4 border-2 rounded-xl text-left transition-all ${
//                               selected
//                                 ? "border-blue-600 bg-blue-50"
//                                 : "border-gray-200 hover:border-blue-300"
//                             }`}
//                           >
//                             <Icon
//                               className={`h-6 w-6 mb-2 ${selected ? "text-blue-600" : "text-gray-400"}`}
//                             />
//                             <div
//                               className={`font-medium ${selected ? "text-blue-900" : "text-gray-900"}`}
//                             >
//                               {p.charAt(0).toUpperCase() + p.slice(1)}
//                             </div>
//                             <div
//                               className={`text-sm ${selected ? "text-blue-600" : "text-gray-500"}`}
//                             >
//                               {p === "share" && "Help others"}
//                               {p === "sell" && "List items for sale"}
//                               {p === "borrow" && "Looking to borrow items"}
//                               {p === "exchange" && "Trade items with others"}
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="space-y-3 pt-4 border-t">
//                     <label className="flex items-start gap-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.agreeTerms}
//                         onChange={(e) =>
//                           handleChange("agreeTerms", e.target.checked)
//                         }
//                         className="mt-1"
//                       />
//                       <span className="text-sm text-gray-600">
//                         I agree to the{" "}
//                         <Link
//                           href="/terms"
//                           className="text-blue-600 hover:underline"
//                         >
//                           Terms of Service
//                         </Link>{" "}
//                         and confirm that I am a member of the Jigjiga University
//                         community
//                       </span>
//                     </label>
//                     {renderError("agreeTerms")}

//                     <label className="flex items-start gap-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.agreeSharingPolicy}
//                         onChange={(e) =>
//                           handleChange("agreeSharingPolicy", e.target.checked)
//                         }
//                         className="mt-1"
//                       />
//                       <span className="text-sm text-gray-600">
//                         I agree to the{" "}
//                         <Link
//                           href="/sharing-policy"
//                           className="text-blue-600 hover:underline"
//                         >
//                           Resource Sharing Policy
//                         </Link>{" "}
//                         and will responsibly share, borrow, and sell items
//                         within the community
//                       </span>
//                     </label>
//                     {renderError("agreeSharingPolicy")}
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex gap-4 pt-4">
//                 {step > 1 && (
//                   <button
//                     type="button"
//                     onClick={handleBack}
//                     disabled={stepTransition}
//                     className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                     Back
//                   </button>
//                 )}
//                 {step < 4 ? (
//                   <button
//                     type="button"
//                     onClick={handleNext}
//                     disabled={stepTransition}
//                     className={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
//                       step === 1 ? "flex-1" : ""
//                     }`}
//                   >
//                     Continue
//                     <ChevronRight className="h-4 w-4" />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isSubmitting || !isStepComplete(4)}
//                     className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                         <span>Creating Account...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Create Account</span>
//                         <ArrowRight className="h-5 w-5" />
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           <p className="mt-8 text-center text-gray-600">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="text-blue-600 hover:text-blue-500 font-semibold"
//             >
//               Sign in here
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Verification Modal - Magic Link Version */}
//       <AnimatePresence>
//         {showVerification && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
//             >
//               <div className="text-center py-4">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Mail className="h-8 w-8 text-green-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Check Your Email! 📧
//                 </h3>
//                 <p className="text-gray-600 mb-2">
//                   We've sent a magic link to:
//                 </p>
//                 <p className="font-semibold text-blue-600 mb-4 break-all">
//                   {verificationEmail}
//                 </p>
//                 <div className="p-4 bg-blue-50 rounded-lg mb-4">
//                   <p className="text-sm text-blue-800">
//                     ✨ Click the link in your email to verify your account
//                     instantly. No code needed!
//                   </p>
//                 </div>
//                 {verificationError && (
//                   <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
//                     <AlertCircle className="h-4 w-4" />
//                     {verificationError}
//                   </div>
//                 )}
//                 <div className="mt-6 flex flex-col gap-3">
//                   <button
//                     onClick={handleResendVerification}
//                     disabled={resendCountdown > 0}
//                     className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
//                   >
//                     {resendCountdown > 0
//                       ? `Resend email in ${resendCountdown}s`
//                       : "Resend verification email"}
//                   </button>
//                   <button
//                     onClick={() => router.push("/login")}
//                     className="text-gray-500 hover:text-gray-700 text-sm"
//                   >
//                     Back to login
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       <Footer />
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Wrench,
  Laptop,
  Trophy,
  Microscope,
  Calculator,
  Palette,
  Camera,
  Music,
  Gamepad2,
  Bike,
  Car,
  DollarSign,
  Package,
  Heart,
  Shield,
  Users,
  Globe,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  User,
  Key,
  School,
  Loader2,
  X,
  Eye,
  EyeOff,
  Gift,
  Save,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import AnnouncementBar from "../../../components/layout/AnnouncementBar";

// ==================== VALIDATION FUNCTIONS ====================

// Email validation
const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!email.includes("@")) return "Please enter a valid email address";
  if (email.length < 5) return "Email is too short";
  return null;
};

// Password validation (minimum 6 characters)
const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// Confirm password validation
const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

// Full name validation
const validateFullName = (name) => {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name is too long";
  return null;
};

// Student ID validation: r/XXXX/XX format
const validateStudentId = (id) => {
  if (!id) return "Student ID is required";
  const regex = /^[rR]\/\d{4}\/\d{2}$/;
  if (!regex.test(id)) return "Format: r/XXXX/XX (e.g., r/0074/13)";
  return null;
};

// Phone validation (Ethiopian format)
const validatePhone = (phone) => {
  if (!phone) return null; // Optional for external users
  const cleaned = phone.replace(/\s/g, "");
  const regex = /^(\+251|0)[9]\d{8}$/;
  if (!regex.test(cleaned)) return "Format: +251XXXXXXXXX or 09XXXXXXXX";
  return null;
};

// Department validation
const validateDepartment = (dept) => {
  if (!dept) return "Department is required";
  return null;
};

// Year of study validation
const validateYearOfStudy = (year) => {
  if (!year) return "Year of study is required";
  return null;
};

// Graduation year validation
const validateGraduationYear = (year) => {
  if (!year) return "Graduation year is required";
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear + 10) {
    return "Please enter a valid year";
  }
  return null;
};

// ==================== COMPONENT ====================

const departments = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Architecture",
  "Business Administration",
  "Accounting",
  "Economics",
  "Law",
  "Medicine",
  "Pharmacy",
  "Nursing",
  "Public Health",
  "Agriculture",
  "Veterinary Medicine",
  "Education",
  "Language Studies",
  "Journalism",
  "Fine Arts",
  "Music",
  "Sports Science",
];

const steps = [
  {
    number: 1,
    title: "Account",
    icon: "User",
    description: "Create your account",
  },
  {
    number: 2,
    title: "University",
    icon: "GraduationCap",
    description: "Verify your affiliation",
  },
  {
    number: 3,
    title: "Contact",
    icon: "Phone",
    description: "How to reach you",
  },
  {
    number: 4,
    title: "Preferences",
    icon: "Heart",
    description: "What you want to share",
  },
];

// Map icon names to components
const getIconComponent = (iconName) => {
  switch (iconName) {
    case "User":
      return User;
    case "GraduationCap":
      return GraduationCap;
    case "Phone":
      return Phone;
    case "Heart":
      return Heart;
    default:
      return User;
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  const { register } = useAuth(); // Remove resendVerification and checkEmailAvailability if not available

  // Form state
  const [step, setStep] = useState(1);
  const [stepTransition, setStepTransition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student", // Changed from "external" to "student" since student fields are required
    studentId: "",
    department: "",
    yearOfStudy: "",
    faculty: "",
    graduationYear: "",
    phone: "",
    campusAddress: "",
    roomNumber: "",
    resourceCategories: [],
    sharingPurpose: [],
    availability: "flexible",
    agreeTerms: false,
    agreeSharingPolicy: false,
    referralCode: referralCode || "",
  });

  // UI state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullNameInputRef = useRef(null);
  const errorRef = useRef(null);
  const draftTimerRef = useRef(null);

  // ==================== VALIDATION FUNCTION ====================
  const validateStep = () => {
    const errors = {};

    if (step === 1) {
      const nameError = validateFullName(formData.fullName);
      if (nameError) errors.fullName = nameError;

      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
      else if (emailAvailable === false)
        errors.email = "Email already registered";

      const passwordError = validatePassword(formData.password);
      if (passwordError) errors.password = passwordError;

      const confirmError = validateConfirmPassword(
        formData.password,
        formData.confirmPassword,
      );
      if (confirmError) errors.confirmPassword = confirmError;
    }

    if (step === 2) {
      if (formData.userType === "student") {
        const studentIdError = validateStudentId(formData.studentId);
        if (studentIdError) errors.studentId = studentIdError;

        const deptError = validateDepartment(formData.department);
        if (deptError) errors.department = deptError;

        const yearError = validateYearOfStudy(formData.yearOfStudy);
        if (yearError) errors.yearOfStudy = yearError;
      }

      if (formData.userType === "faculty") {
        const deptError = validateDepartment(formData.department);
        if (deptError) errors.department = deptError;
      }

      if (formData.userType === "alumni") {
        const deptError = validateDepartment(formData.department);
        if (deptError) errors.department = deptError;

        const gradError = validateGraduationYear(formData.graduationYear);
        if (gradError) errors.graduationYear = gradError;
      }
    }

    if (step === 3) {
      if (formData.userType !== "external") {
        const phoneError = validatePhone(formData.phone);
        if (phoneError) errors.phone = phoneError;
      }
    }

    if (step === 4) {
      if (!formData.agreeTerms)
        errors.agreeTerms = "You must agree to the Terms of Service";
      if (!formData.agreeSharingPolicy)
        errors.agreeSharingPolicy = "You must agree to the Sharing Policy";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== FIELD HANDLERS ====================
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateStep();
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateStep();
  };

  // ==================== EMAIL AVAILABILITY CHECK ====================
  // Simplified version without API call if checkEmailAvailability is not available
  useEffect(() => {
    const checkEmail = async () => {
      if (
        !formData.email ||
        formData.email.length < 5 ||
        !formData.email.includes("@")
      ) {
        setEmailAvailable(null);
        return;
      }
      setCheckingEmail(true);

      try {
        // Try to check email availability if the function exists
        const response = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(formData.email)}`,
        );
        const data = await response.json();
        setEmailAvailable(data.available);
      } catch (error) {
        // If API doesn't exist, just set as available (will be checked on submit)
        setEmailAvailable(true);
      }

      setCheckingEmail(false);
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // ==================== AUTO-SAVE DRAFT ====================
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      localStorage.setItem("register_draft", JSON.stringify(formData));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }, 3000);
    return () => clearTimeout(draftTimerRef.current);
  }, [formData]);

  // ==================== LOAD SAVED DRAFT ====================
  // useEffect(() => {
  //   const saved = localStorage.getItem("register_draft");
  //   if (saved) {
  //     const shouldContinue = window.confirm(
  //       "You have a saved draft. Would you like to continue?",
  //     );
  //     if (shouldContinue) {
  //       setFormData(JSON.parse(saved));
  //     }
  //   }
  //   fullNameInputRef.current?.focus();
  // }, []);

  // ==================== STEP NAVIGATION ====================
  const handleNext = () => {
    if (validateStep()) {
      setStepTransition(true);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setStepTransition(false);
        setError("");
      }, 300);
    } else {
      setError("Please fix the errors before continuing");
      // Scroll to first error
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus();
      }
    }
  };

  const handleBack = () => {
    setStepTransition(true);
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setStepTransition(false);
      setError("");
    }, 300);
  };

  // ==================== RESEND VERIFICATION ====================
  const handleResendVerification = async () => {
    if (resendCountdown > 0) return;

    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("New verification email sent! Check your inbox.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setVerificationError(data.error || "Failed to resend verification");
      }
    } catch (error) {
      setVerificationError("Failed to resend. Please try again.");
    }
  };

  // ==================== REGISTRATION SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      setError("Please fix all errors before submitting");
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setError("");

    const cleanData = { ...formData };

    // Remove confirmPassword as it's not needed for API
    delete cleanData.confirmPassword;

    // Clean data based on user type
    if (cleanData.userType !== "student") {
      delete cleanData.studentId;
      delete cleanData.yearOfStudy;
    }

    if (cleanData.userType !== "faculty" && cleanData.userType !== "alumni") {
      delete cleanData.faculty;
    }

    if (cleanData.userType !== "alumni") {
      delete cleanData.graduationYear;
    }

    if (cleanData.userType === "external") {
      delete cleanData.phone;
      delete cleanData.studentId;
      delete cleanData.department;
      delete cleanData.yearOfStudy;
      delete cleanData.faculty;
      delete cleanData.graduationYear;
    }

    if (!cleanData.campusAddress) delete cleanData.campusAddress;
    if (!cleanData.roomNumber) delete cleanData.roomNumber;
    if (!cleanData.resourceCategories?.length)
      delete cleanData.resourceCategories;
    if (!cleanData.sharingPurpose?.length) delete cleanData.sharingPurpose;

    const result = await register(cleanData);

    if (result.success) {
      setVerificationEmail(formData.email);
      setShowVerification(true);
      setSuccess(
        "Registration successful! Check your email for the verification link.",
      );

      // Start countdown for resend
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      localStorage.removeItem("register_draft");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  // ==================== CHECK STEP COMPLETION ====================
  const isStepComplete = (stepNum) => {
    if (stepNum === 1) {
      return (
        formData.fullName &&
        formData.email &&
        emailAvailable !== false &&
        formData.password &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 6
      );
    }
    if (stepNum === 2) {
      if (formData.userType === "student") {
        return (
          formData.studentId &&
          validateStudentId(formData.studentId) === null &&
          formData.department &&
          formData.yearOfStudy
        );
      }
      if (formData.userType === "faculty") {
        return formData.department;
      }
      if (formData.userType === "alumni") {
        return formData.department && formData.graduationYear;
      }
      return true;
    }
    if (stepNum === 3) {
      if (formData.userType !== "external") {
        return formData.phone && validatePhone(formData.phone) === null;
      }
      return true;
    }
    if (stepNum === 4) {
      return formData.agreeTerms && formData.agreeSharingPolicy;
    }
    return false;
  };

  // ==================== RENDER ERROR MESSAGE ====================
  const renderError = (field) => {
    if (fieldErrors[field] && touched[field]) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {fieldErrors[field]}
        </p>
      );
    }
    return null;
  };

  // ==================== JSX ====================
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Jigjiga University
            </h1>
            <p className="text-xl text-gray-600">
              Resource Sharing & Exchange Platform
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s) => {
                const IconComponent = getIconComponent(s.icon);
                return (
                  <div key={s.number} className="flex items-center">
                    <button
                      onClick={() => {
                        if (isStepComplete(s.number - 1) && s.number < step) {
                          setStep(s.number);
                        }
                      }}
                      disabled={
                        !isStepComplete(s.number - 1) && s.number < step
                      }
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= s.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      } ${
                        isStepComplete(s.number) && step !== s.number
                          ? "ring-2 ring-green-500 ring-offset-2"
                          : ""
                      }`}
                    >
                      {step > s.number ||
                      (isStepComplete(s.number) && step !== s.number)
                        ? "✓"
                        : s.number}
                    </button>
                    {s.number < steps.length && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all ${
                          step > s.number ||
                          (isStepComplete(s.number) && step > s.number)
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm text-gray-600 px-2">
              {steps.map((s) => (
                <span key={s.number}>
                  {s.title} {isStepComplete(s.number) && "✓"}
                </span>
              ))}
            </div>
          </div>

          {/* Main Form Card */}
          <div
            className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
              stepTransition ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {(() => {
                    const IconComponent = getIconComponent(
                      steps[step - 1].icon,
                    );
                    return <IconComponent className="h-5 w-5 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {steps[step - 1].title}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {steps[step - 1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                ref={errorRef}
                className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Draft Saved Toast */}
            {draftSaved && (
              <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2 z-50">
                <Save className="h-4 w-4" />
                <span>Draft saved</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["student", "faculty", "alumni", "external"].map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleChange("userType", type)}
                            className={`p-4 border-2 rounded-xl text-left transition-all ${
                              formData.userType === type
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="text-2xl mb-2">
                              {type === "student" && "🎓"}
                              {type === "faculty" && "👨‍🏫"}
                              {type === "alumni" && "🌟"}
                              {type === "external" && "🤝"}
                            </div>
                            <div className="font-medium text-gray-900">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {type === "student" && "Current student"}
                              {type === "faculty" && "Staff member"}
                              {type === "alumni" && "Graduate"}
                              {type === "external" && "Community partner"}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="fullName"
                        ref={fullNameInputRef}
                        type="text"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        onBlur={() => handleBlur("fullName")}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.fullName && touched.fullName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {renderError("fullName")}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.email && touched.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="you@example.com"
                      />
                      {checkingEmail && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
                      )}
                      {emailAvailable === true &&
                        formData.email &&
                        !checkingEmail && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                    </div>
                    {renderError("email")}
                    {emailAvailable === true &&
                      !fieldErrors.email &&
                      formData.email && (
                        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Email is available
                        </p>
                      )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        onBlur={() => handleBlur("password")}
                        className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.password && touched.password
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="At least 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {renderError("password")}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleChange("confirmPassword", e.target.value)
                        }
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.confirmPassword && touched.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {renderError("confirmPassword")}
                  </div>

                  {/* Referral Code Display */}
                  {referralCode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Code
                      </label>
                      <div className="relative">
                        <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.referralCode}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                        />
                      </div>
                      <p className="mt-1 text-sm text-green-600">
                        You'll receive bonus points for using a referral code!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: University Information */}
              {step === 2 && (
                <div className="space-y-5">
                  {formData.userType === "student" && (
                    <>
                      <div>
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Student ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="studentId"
                            type="text"
                            autoComplete="off"
                            value={formData.studentId}
                            onChange={(e) =>
                              handleChange("studentId", e.target.value)
                            }
                            onBlur={() => handleBlur("studentId")}
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              fieldErrors.studentId && touched.studentId
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="r/0074/13"
                          />
                          {validateStudentId(formData.studentId) === null &&
                            formData.studentId && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                            )}
                        </div>
                        {renderError("studentId")}
                        <p className="mt-1 text-sm text-gray-500">
                          Format: r/XXXX/XX (e.g., r/0074/13)
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="department"
                          value={formData.department}
                          onChange={(e) =>
                            handleChange("department", e.target.value)
                          }
                          onBlur={() => handleBlur("department")}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            fieldErrors.department && touched.department
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select your department</option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {renderError("department")}
                      </div>

                      <div>
                        <label
                          htmlFor="yearOfStudy"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Year of Study <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={(e) =>
                            handleChange("yearOfStudy", e.target.value)
                          }
                          onBlur={() => handleBlur("yearOfStudy")}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            fieldErrors.yearOfStudy && touched.yearOfStudy
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                          <option value="graduate">Graduate Student</option>
                        </select>
                        {renderError("yearOfStudy")}
                      </div>
                    </>
                  )}

                  {formData.userType === "faculty" && (
                    <>
                      <div>
                        <label
                          htmlFor="facultyDepartment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="facultyDepartment"
                          value={formData.department}
                          onChange={(e) =>
                            handleChange("department", e.target.value)
                          }
                          onBlur={() => handleBlur("department")}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            fieldErrors.department && touched.department
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select your department</option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {renderError("department")}
                      </div>

                      <div>
                        <label
                          htmlFor="faculty"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Faculty/Position
                        </label>
                        <input
                          id="faculty"
                          type="text"
                          autoComplete="organization-title"
                          value={formData.faculty}
                          onChange={(e) =>
                            handleChange("faculty", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Professor, Lecturer, Researcher"
                        />
                      </div>
                    </>
                  )}

                  {formData.userType === "alumni" && (
                    <>
                      <div>
                        <label
                          htmlFor="alumniDepartment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="alumniDepartment"
                          value={formData.department}
                          onChange={(e) =>
                            handleChange("department", e.target.value)
                          }
                          onBlur={() => handleBlur("department")}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            fieldErrors.department && touched.department
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select your department</option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {renderError("department")}
                      </div>

                      <div>
                        <label
                          htmlFor="graduationYear"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Graduation Year{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="graduationYear"
                          type="text"
                          autoComplete="off"
                          value={formData.graduationYear}
                          onChange={(e) =>
                            handleChange("graduationYear", e.target.value)
                          }
                          onBlur={() => handleBlur("graduationYear")}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            fieldErrors.graduationYear && touched.graduationYear
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., 2020"
                        />
                        {renderError("graduationYear")}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number{" "}
                      {formData.userType !== "external" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.phone && touched.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="+251 91X XXX XXX or 09XX XXX XXX"
                      />
                      {validatePhone(formData.phone) === null &&
                        formData.phone && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                    </div>
                    {renderError("phone")}
                    <p className="mt-1 text-sm text-gray-500">
                      Format: +251XXXXXXXXX or 09XXXXXXXX
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="campusAddress"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Campus Address (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="campusAddress"
                        type="text"
                        autoComplete="street-address"
                        value={formData.campusAddress}
                        onChange={(e) =>
                          handleChange("campusAddress", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Main Campus, Block A"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="roomNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Room/Dorm Number (Optional)
                    </label>
                    <input
                      id="roomNumber"
                      type="text"
                      autoComplete="off"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        handleChange("roomNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Room 203, Dorm B"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Availability for Sharing
                    </label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) =>
                        handleChange("availability", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="flexible">Flexible (Any time)</option>
                      <option value="weekdays">Weekdays (Mon-Fri)</option>
                      <option value="weekends">Weekends (Sat-Sun)</option>
                      <option value="evenings">Evenings (After 5 PM)</option>
                      <option value="mornings">Mornings (Before 12 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences & Agreement */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What do you want to do?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["share", "sell", "borrow", "exchange"].map((p) => {
                        const icons = {
                          share: Heart,
                          sell: DollarSign,
                          borrow: Package,
                          exchange: ArrowRight,
                        };
                        const Icon = icons[p];
                        const selected = formData.sharingPurpose.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              const newPurposes = selected
                                ? formData.sharingPurpose.filter((x) => x !== p)
                                : [...formData.sharingPurpose, p];
                              handleChange("sharingPurpose", newPurposes);
                            }}
                            className={`p-4 border-2 rounded-xl text-left transition-all ${
                              selected
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <Icon
                              className={`h-6 w-6 mb-2 ${selected ? "text-blue-600" : "text-gray-400"}`}
                            />
                            <div
                              className={`font-medium ${selected ? "text-blue-900" : "text-gray-900"}`}
                            >
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </div>
                            <div
                              className={`text-sm ${selected ? "text-blue-600" : "text-gray-500"}`}
                            >
                              {p === "share" && "Help others"}
                              {p === "sell" && "List items for sale"}
                              {p === "borrow" && "Looking to borrow items"}
                              {p === "exchange" && "Trade items with others"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          handleChange("agreeTerms", e.target.checked)
                        }
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and confirm that I am a member of the Jigjiga University
                        community
                      </span>
                    </label>
                    {renderError("agreeTerms")}

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeSharingPolicy}
                        onChange={(e) =>
                          handleChange("agreeSharingPolicy", e.target.checked)
                        }
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link
                          href="/sharing-policy"
                          className="text-blue-600 hover:underline"
                        >
                          Resource Sharing Policy
                        </Link>{" "}
                        and will responsibly share, borrow, and sell items
                        within the community
                      </span>
                    </label>
                    {renderError("agreeSharingPolicy")}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={stepTransition}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={stepTransition}
                    className={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                      step === 1 ? "flex-1" : ""
                    }`}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepComplete(4)}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Check Your Email! 📧
                </h3>
                <p className="text-gray-600 mb-2">
                  We've sent a verification link to:
                </p>
                <p className="font-semibold text-blue-600 mb-4 break-all">
                  {verificationEmail}
                </p>
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    ✨ Click the link in your email to verify your account
                    instantly. No code needed!
                  </p>
                </div>
                {verificationError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {verificationError}
                  </div>
                )}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendCountdown > 0}
                    className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                  >
                    {resendCountdown > 0
                      ? `Resend email in ${resendCountdown}s`
                      : "Resend verification email"}
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}