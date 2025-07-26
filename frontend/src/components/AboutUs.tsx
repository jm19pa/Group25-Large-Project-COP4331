import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <div className="container" style={{ height: '100%', width: '800px',marginBottom: '20px' }}>
        <div className="about-row">
          <img src="/images/DavidGusmao.png" alt="About Us" />
          <div className="about-text">
            <h2>David Gusmao: Project Manager</h2>
            <p>
              Contributions:
              Name & Website Theming,
              All Cards,
              All Art,
              Powerpoint,
              Gantt Chart,
              Recourse Allocation,
              Droplet,
              Domain
            </p>
          </div>
        </div>
      </div>
      <div className="container" style={{ height: '100%', width: '800px',marginBottom: '20px'  }}>
        <div className="about-row">
          <img src="/images/TylerTran.png" alt="TylerTran" />
          <div className="about-text">
            <h2>Tyler Tran: Database Management</h2>
            <p>
              Contributions:
              SendGrid implementation,
              Unit testing,
              MongoDB Setup,
              ENV Setup,
              Yaml Setup
            </p>
          </div>
        </div>
      </div>
      <div className="container" style={{ height: '100%',width: '800px', marginBottom: '20px'  }}>
        <div className="about-row">
          <img src="/images/TylerTakimoto.png" alt="TakiTy" />
          <div className="about-text">
            <h2>Tyler Takimoto: Frontend Development</h2>
            <p>
              Contributions:
              Website Design,
              Flutter Setup,
              Mobile Development,
              Mobile Design
            </p>
          </div>
        </div>
      </div>
      <div className="container" style={{ height: '100%', width: '800px',  marginBottom: '20px'  }}>
        <div className="about-row">
          <img src="/images/JuanPinero.png" alt="Juan"/>
          <div className="about-text">
            <h2>Juan Pinero: Frontend Development</h2>
            <p>
              Contributions:
              Website Design,
              Mobile Development,
              API Assistance,
              PowerPoint Assistance
            </p>
          </div>
        </div>
      </div>
      <div className="container" style={{ height: '100%', width: '800px',marginBottom: '5px'  }}>
        <div className="about-row">
          <img src="/images/AndrewChambers.png" alt="Andrew" />
          <div className="about-text">
            <h2>Andrew Chambers: API Development</h2>
            <p>
              Contributions:
              API Design,
              Sever Setup,
              API Setup,
              API Testing
              API Documentation,

            </p>
          </div>
        </div>
      </div>
      <a href="https://github.com/jm19pa/Group25-Large-Project-COP4331" target="_blank" title="View our GitHub!">
    <img src="images/transparentMonkey.gif" width="100%" style={{ transform: 'scaleX(-1)' }} />
</a>
    </div>
  );
}

export default AboutUs;