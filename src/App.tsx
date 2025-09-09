import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [authKey, setAuthKey] = useState<string>("");
  const [petId, setPetId] = useState<string>("");
  const [petName, setPetName] = useState<string>("");
  const [petType, setPetType] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'system'}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // axios helper
  const doRequest = async (
    url: string,
    method: "get" | "post" | "patch" | "delete",
    body?: object
  ) => {
    setIsLoading(true);
    try {
      const res = await axios({
        url,
        method,
        data: body,
        headers: { "Content-Type": "application/json" },
      });
      setIsLoading(false);
      return res.data;
    } catch (err: any) {
      setIsLoading(false);
      return err.response?.data || { message: "Error" };
    }
  };

  // helper to add messages to the chat
  const addMessage = (text: string, sender: 'user' | 'system' = 'system') => {
    setMessages(prev => [...prev, {text, sender}]);
  };

  // helper to go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // handlers
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest("https://prelim-exam.onrender.com/signup", "post", {
      username,
      password,
    });
    addMessage(data.message || JSON.stringify(data));
    setStep(2);
  };

  const handleSignupWithAge = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest("https://prelim-exam.onrender.com/signup", "post", {
      username,
      password,
      age,
    });
    
    let responseMsg = data.message || JSON.stringify(data);
    if (data.id) {
      setId(data.id);
      responseMsg += `\nID: ${data.id}`;
    }
    if (data.code) {
      setAuthKey(data.code);
      responseMsg += `\nCode: ${data.code}`;
    }
    
    addMessage(responseMsg);
    setStep(3);
  };

  const handleLoginWithoutAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest("https://prelim-exam.onrender.com/login", "post", {
      username,
      password,
      age,
    });
    
    let responseMsg = data.message || JSON.stringify(data);
    addMessage(responseMsg);
    setStep(4);
  };

  
  const handleLoginWithAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest("https://prelim-exam.onrender.com/login", "post", {
      username,
      password,
      age,
      authKey,
    });

    let responseMsg = data.message || JSON.stringify(data);
    if (data.id) {
      setId(data.id);
      responseMsg += `\nID: ${data.id}`;
    }
    if (data.code) {
      setAuthKey(data.code);
      responseMsg += `\nCode: ${data.code}`;
    }

    addMessage(responseMsg);
    setStep(5);
  };

  const handleEditUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest(
      `https://prelim-exam.onrender.com/users/${id}`,
      "patch",
      { username, password, age, authKey }
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(6);
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest("https://prelim-exam.onrender.com/pets/new", "post", {
      ownerId: id,
      name: petName,
      type: petType,
    });
    
    let responseMsg = data.message || JSON.stringify(data);
    if (data.petId) {
      setPetId(data.petId);
      responseMsg += `\nPet ID: ${data.petId}`;
    }
    
    addMessage(responseMsg);
    setStep(7);
  };

  const handleViewUserPets = async () => {
    const data = await doRequest(
      `https://prelim-exam.onrender.com/users/${id}/pets`,
      "get"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(8);
  };

  const handleViewAllPets = async () => {
    const data = await doRequest(
      `https://prelim-exam.onrender.com/pets?userId=${id}`,
      "get"
    );
    
    let responseMsg = data.message || JSON.stringify(data);
    addMessage(responseMsg);
    setStep(9);
  };

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await doRequest(
      `https://prelim-exam.onrender.com/users/${id}`,
      "patch",
      { role }
    );
    
    let responseMsg = data.message || JSON.stringify(data);
    addMessage(responseMsg);
    setStep(10);
  };

  const handleViewAllPetsAsAdmin = async () => {
    const data = await doRequest(
      `https://prelim-exam.onrender.com/pets?userId=${id}`,
      "get"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(11);
  };

  const handleGetPetCount = async () => {
    const data = await doRequest(
      "https://prelim-exam.onrender.com/stats/pets/count",
      "get"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(12);
  };

  const handleDeletePet = async () => {
    const data = await doRequest(
      `https://prelim-exam.onrender.com/pets/${petId}`,
      "delete"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(13);
  };

  const handleGetAgeStats = async () => {
    const data = await doRequest(
      "https://prelim-exam.onrender.com/stats/users/ages",
      "get"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(14);
  };

  const handleGetUserCount = async () => {
    const data = await doRequest(
      "https://prelim-exam.onrender.com/stats/users/count",
      "get"
    );
    addMessage(data.message || JSON.stringify(data));
    setStep(15);
  };

  const handleLogout = async () => {
    const data = await doRequest("https://prelim-exam.onrender.com/logout", "post");
    addMessage(data.message || JSON.stringify(data));
    setStep(16);
  };

  return (
    <div className="playground-container">
      <div className="app-wrapper">
        {/* header */}
        <header className="app-header">
          <h1 className="app-title">Preliminary Exam Part 2</h1>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(step / 16) * 100}%`}}
              ></div>
            </div>
            <span className="progress-text">Step {step} of 16</span>
          </div>
        </header>

        <div className="app-content">
          {/* message area */}
          <div className="chat-container">
            <div className="chat-header">
              <h3>API Responses</h3>
            </div>
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}>
                  <div className="message-content">
                    <pre>{msg.text}</pre>
                  </div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* form section */}
          <div className="form-container">
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* back button */}
            {step > 1 && step < 16 && (
              <button 
                className="btn btn-outline-secondary mb-3" 
                onClick={goBack}
              >
                ← Back
              </button>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="step-card">
                <h3 className="step-title">Step 1: Create Account</h3>
                <p className="step-description">Start by creating your account with a username and password.</p>
                <form onSubmit={handleSignup}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-primary w-100 mt-3">Sign Up</button>
                </form>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="step-card">
                <h3 className="step-title">Step 2: Complete Profile</h3>
                <p className="step-description">Please provide your age to complete your profile.</p>
                <form onSubmit={handleSignupWithAge}>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-success w-100 mt-3">Submit Age</button>
                </form>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="step-card">
                <h3 className="step-title">Step 3: Login (Without Auth Key)</h3>
                <p className="step-description">Try logging in without the authentication key to see what happens.</p>
                <form onSubmit={handleLoginWithoutAuth}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-warning w-100 mt-3">Login Without AuthKey</button>
                </form>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="step-card">
                <h3 className="step-title">Step 4: Login (With Auth Key)</h3>
                <p className="step-description">Now login with your authentication key to proceed.</p>
                <form onSubmit={handleLoginWithAuth}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Authentication Key</label>
                    <input
                      className="form-control"
                      placeholder="Enter your auth key"
                      value={authKey}
                      onChange={(e) => setAuthKey(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-warning w-100 mt-3">Login With AuthKey</button>
                </form>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="step-card">
                <h3 className="step-title">Step 5: Update Profile</h3>
                <p className="step-description">Change your username to something new.</p>
                <form onSubmit={handleEditUsername}>
                  <div className="form-group">
                    <label>New Username</label>
                    <input
                      className="form-control"
                      placeholder="Enter new username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-info w-100 mt-3">Update Username</button>
                </form>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="step-card">
                <h3 className="step-title">Step 6: Add a Pet</h3>
                <p className="step-description">Add a pet to your account.</p>
                <form onSubmit={handleAddPet}>
                  <div className="form-group">
                    <label>Pet Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter pet name"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Pet Type</label>
                    <input
                      className="form-control"
                      placeholder="Enter pet type (dog, cat, etc.)"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-success w-100 mt-3">Add Pet</button>
                </form>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div className="step-card">
                <h3 className="step-title">Step 7: View Your Pets</h3>
                <p className="step-description">View all pets associated with your account.</p>
                <button onClick={handleViewUserPets} className="btn btn-primary w-100">
                  View My Pets
                </button>
              </div>
            )}

            {/* STEP 8 */}
            {step === 8 && (
              <div className="step-card">
                <h3 className="step-title">Step 8: View All Pets (Unauthorized)</h3>
                <p className="step-description">Try to view all pets without admin privileges.</p>
                <button onClick={handleViewAllPets} className="btn btn-secondary w-100">
                  Try to View All Pets (Unauthorized)
                </button>
              </div>
            )}

            {/* STEP 9 */}
            {step === 9 && (
              <div className="step-card">
                <h3 className="step-title">Step 9: Become an Admin</h3>
                <p className="step-description">Change your role to admin to gain additional privileges.</p>
                <form onSubmit={handleChangeRole}>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      className="form-control"
                      placeholder="Enter 'admin'"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-warning w-100 mt-3">Change Role to Admin</button>
                </form>
              </div>
            )}

            {/* STEP 10 */}
            {step === 10 && (
              <div className="step-card">
                <h3 className="step-title">Step 10: View All Pets (Admin)</h3>
                <p className="step-description">Now view all pets with your admin privileges.</p>
                <button onClick={handleViewAllPetsAsAdmin} className="btn btn-primary w-100">
                  View All Pets as Admin
                </button>
              </div>
            )}

            {/* STEP 11 */}
            {step === 11 && (
              <div className="step-card">
                <h3 className="step-title">Step 11: Get Pet Count</h3>
                <p className="step-description">Retrieve the total count of pets in the system.</p>
                <button onClick={handleGetPetCount} className="btn btn-info w-100">
                  Get Pet Count
                </button>
              </div>
            )}

            {/* STEP 12 */}
            {step === 12 && (
              <div className="step-card">
                <h3 className="step-title">Step 12: Delete a Pet</h3>
                <p className="step-description">Delete the pet you previously added.</p>
                <button onClick={handleDeletePet} className="btn btn-danger w-100">
                  Delete Pet
                </button>
              </div>
            )}

            {/* STEP 13 */}
            {step === 13 && (
              <div className="step-card">
                <h3 className="step-title">Step 13: Get Age Statistics</h3>
                <p className="step-description">View statistics about user ages.</p>
                <button onClick={handleGetAgeStats} className="btn btn-secondary w-100">
                  Get Age Statistics
                </button>
              </div>
            )}

            {/* STEP 14 */}
            {step === 14 && (
              <div className="step-card">
                <h3 className="step-title">Step 14: Get User Count</h3>
                <p className="step-description">View the total number of users in the system.</p>
                <button onClick={handleGetUserCount} className="btn btn-info w-100">
                  Get User Count
                </button>
              </div>
            )}

            {/* STEP 15 */}
            {step === 15 && (
              <div className="step-card">
                <h3 className="step-title">Step 15: Logout</h3>
                <p className="step-description">Log out from your account.</p>
                <button onClick={handleLogout} className="btn btn-danger w-100">
                  Logout
                </button>
              </div>
            )}

            {/* STEP 16 */}
            {step === 16 && (
              <div className="step-card text-center">
                <div className="completion-animation">
                  <div className="checkmark">✓</div>
                </div>
                <h2 className="text-success">Congratulations!</h2>
                <p>You've successfully completed all 16 tasks.</p>
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setStep(1);
                    setMessages([]);
                  }}
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
