import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-page">
      <h1>About Us</h1>

      {[
        {
          name: 'David Gusmao',
          title: 'Project Manager',
          image: '/images/DavidGusmao.webp',
          contributions: 'Name & Website Theming, All Cards, All Art, Powerpoint, Gantt Chart, Recourse Allocation, Droplet, Domain',
        },
        {
          name: 'Tyler Tran',
          title: 'Database Management',
          image: '/images/TylerTran.webp',
          contributions: 'SendGrid implementation, Unit testing, MongoDB Setup, ENV Setup, Yaml Setup',
        },
        {
          name: 'Tyler Takimoto',
          title: 'Frontend Development',
          image: '/images/TylerTakimoto.webp',
          contributions: 'Website Design, Flutter Setup, Mobile Development, Mobile Design',
        },
        {
          name: 'Juan Pinero',
          title: 'Frontend Development',
          image: '/images/JuanoPinero.webp',
          contributions: 'Website Design, Mobile Development, API Assistance, PowerPoint Assistance',
        },
        {
          name: 'Andrew Chambers',
          title: 'API Development',
          image: '/images/AndrewChambers.webp',
          contributions: 'API Design, Sever Setup, API Setup, API Testing, API Documentation',
        },
      ].map((person, index) => (
        <div className="about-container" key={index}>
          <div className="about-row">
            <img src={person.image} alt={person.name} />
            <div className="about-text">
              <h2>{`${person.name}: ${person.title}`}</h2>
              <p>Contributions: {person.contributions}</p>
            </div>
          </div>
        </div>
      ))}

      <a
        href="https://github.com/jm19pa/Group25-Large-Project-COP4331"
        target="_blank"
        rel="noopener noreferrer"
        title="View our GitHub!"
      >
        <img
          src="/images/transparentMonkey.gif"
          className="github-monkey"
          alt="GitHub Monkey"
        />
      </a>
    </div>
  );
};

export default AboutUs;
