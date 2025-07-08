function EmailVerification(){
    return (
        <div>
            <h1>Verify your Email</h1>
            <p>For development purposes: Use 6-character email verification</p>
            <div className="verification">
                <label className="text">Input 6-digit code here:</label>
                <input className="input" id="verificationCode" type="text" placeholder="######"/>
            </div>
        </div>

    )
}

export default EmailVerification;

