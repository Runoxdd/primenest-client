import "./contactPage.scss";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="container">
        <div className="textContainer">
          <h1>Direct <span>Uplink</span></h1>
          <p>
            Have questions about a global listing or want to join our verified agent network? 
            Reach out to the PrimeNest intelligence team.
          </p>
          
          <div className="info">
            <div className="item">
              <span className="icon">📍</span>
              <div className="details">
                <p className="label">Global HQ</p>
                <p>Prime Nest Building, London, E14</p>
              </div>
            </div>
            <div className="item">
              <span className="icon">✉️</span>
              <div className="details">
                <p className="label">Neural Mail</p>
                <p>runoefekemo@gmail.com</p>
              </div>
            </div>
            <div className="item">
              <span className="icon">📞</span>
              <div className="details">
                <p className="label">Direct Line</p>
                <p>+234 8027552093</p>
              </div>
            </div>
          </div>
        </div>

        <div className="formContainer">
          <form>
            <div className="inputGroup">
              <input type="text" placeholder="Full Name" required />
            </div>
            <div className="inputGroup">
              <input type="email" placeholder="Email Address" required />
            </div>
            <div className="inputGroup">
              <select>
                <option value="general">General Inquiry</option>
                <option value="agent">Agent Verification</option>
                <option value="technical">Technical Support</option>
                <option value="business">Business Partnership</option>
              </select>
            </div>
            <div className="inputGroup">
              <textarea placeholder="Your Message..." rows="6"></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;