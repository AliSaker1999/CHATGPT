import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, UpdateProfileDto } from "../Services/UserService";

const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Bootcamp/Certification",
  "Other"
];

const User = () => {
  const [profile, setProfile] = useState<UpdateProfileDto>({
    fullName: "",
    educationLevel: "",
    yearsOfExperience: 0,
    specialty: "",
    currentRole: "",
    age: 0,
    country: "",
    preferredLanguage: "",
    technologiesKnown: "",
    certifications: "",
    learningGoals: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setProfile({
          fullName: data.fullName || "",
          educationLevel: data.educationLevel || "",
          yearsOfExperience: data.yearsOfExperience || 0,
          specialty: data.specialty || "",
          currentRole: data.currentRole || "",
          age: data.age || 0,
          country: data.country || "",
          preferredLanguage: data.preferredLanguage || "",
          technologiesKnown: data.technologiesKnown || "",
          certifications: data.certifications || "",
          learningGoals: data.learningGoals || ""
        });
      } catch (e) {
        setError("Failed to load profile.");
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  setSaving(true);
  setSuccess("");
  setError(null);
  try {
    await updateProfile(profile);
    setSuccess("Profile updated!");
  } catch (e: any) {
    // Try to show backend error message
    if (e.response?.data) setError(e.response.data.toString());
    else setError("Update failed.");
  }
  setSaving(false);
};


  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-green-100 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-100 flex items-center justify-center rounded-full shadow-xl border-4 border-white">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M12 16v6M16 20h-8" />
          </svg>
        </div>
        <h2 className="text-3xl font-black mb-5 text-green-700 text-center mt-6">Update Your Profile</h2>

        {success && <div className="mb-2 text-green-600 text-center bg-green-50 border border-green-200 rounded p-2">{success}</div>}
        {error && <div className="mb-2 text-red-600 text-center bg-red-50 border border-red-200 rounded p-2">{error}</div>}

        <form className="space-y-4" autoComplete="off" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Full Name" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Education Level</label>
              <select name="educationLevel" value={profile.educationLevel} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300">
                <option value="">Select</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Years of Experience</label>
              <input type="number" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="e.g. 3" min={0} />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Specialty</label>
              <input type="text" name="specialty" value={profile.specialty} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="e.g. Web Development" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Current Role</label>
              <input type="text" name="currentRole" value={profile.currentRole} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Age</label>
              <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Age" min={0} />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Country</label>
              <input type="text" name="country" value={profile.country} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Country" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Preferred Language</label>
              <input type="text" name="preferredLanguage" value={profile.preferredLanguage} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="e.g. English" />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Technologies Known</label>
            <input type="text" name="technologiesKnown" value={profile.technologiesKnown} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="e.g. React, C#, SQL" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Certifications</label>
            <input type="text" name="certifications" value={profile.certifications} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Certifications" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Learning Goals</label>
            <input type="text" name="learningGoals" value={profile.learningGoals} onChange={handleChange} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="What do you want to learn next?" />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold shadow hover:bg-green-700 transition text-lg"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* AI Warning Section */}
        <div className="mt-6 mb-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex items-center gap-2 mb-1 text-yellow-800 font-semibold">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            Important!
          </div>
          <div className="text-yellow-800">
            <b>Your profile information will be analyzed by AI to personalize your quiz.</b> 
            <br />
            Make sure your details are correct before taking the test. Once you click <b>Go To Quiz</b>, the AI will use this data to select questions just for you.
          </div>
        </div>

        <button
          onClick={() => navigate("/user/quiz")}
          className="w-full mt-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-all text-xl"
        >
          Go To Quiz
        </button>
      </div>
    </div>
  );
};

export default User;
