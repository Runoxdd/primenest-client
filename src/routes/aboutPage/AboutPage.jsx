import "./aboutPage.scss";

function AboutPage() {
  const values = [
    {
      id: 1,
      title: "Neural Accuracy",
      desc: "Our AI doesn't just search; it understands market patterns to find hidden value.",
      icon: "⚡" 
    },
    {
      id: 2,
      title: "Secure Uplink",
      desc: "End-to-end encrypted negotiations between buyers and sellers.",
      icon: "🛡️"
    },
    {
      id: 3,
      title: "Transparent Ledger",
      desc: "No hidden fees or ghost listings. Every data point is verified by our protocol.",
      icon: "💎"
    }
  ];

  return (
    <div className="aboutPage">
      <div className="container">
        <section className="hero">
          <div className="textContainer">
            <h1>The <span>Vision</span></h1>
            <p className="subtitle">Redefining the architecture of real estate through intelligence.</p>
            <p className="description">
              We started with a simple premise: The traditional real estate market is broken. 
              Slow, opaque, and outdated. We built this platform to be the "OS" for property—
              a fast, AI-augmented ecosystem where finding a home is as fluid as data transfer.
            </p>
          </div>
          <div className="imgContainer">
            <img src="about-hero.jpg" alt="Futuristic City" />
          </div>
        </section>

        <section className="missionVision">
          <div className="box">
            <h2>Our Mission</h2>
            <p>To eliminate the friction of property acquisition using proprietary AI agents.</p>
          </div>
          <div className="box">
            <h2>Our Vision</h2>
            <p>A world where the home you want is found before you even start looking.</p>
          </div>
        </section>

        <section className="values">
          <h1>Core <span>Protocols</span></h1>
          <div className="grid">
            {values.map(value => (
              <div className="card" key={value.id}>
                <div className="icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;