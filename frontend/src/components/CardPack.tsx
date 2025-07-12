import React, {useState, useEffect} from 'react';



const CardPack: React.FC = () => {
  // some logic
  const [shaking, setShaking] = useState(false);
  const [showPoof, setShowPoof] = useState(false);

 useEffect(() => {
    const img = new Image();
    img.src = "/images/poof.png";
  }, []);

  function handleClick() {
    // Start shake
    setShaking(true);
    // When shake ends, show poof
    setTimeout(() => {
      setShaking(false);
      setShowPoof(true);
    }, 1000); // match shake duration
    // Hide poof after its animation
    setTimeout(() => setShowPoof(false), 2000);
  }


    function goToLoggedInPage() {
        window.location.href = '/cards';
    }
  return (
    <div>
        <h2>Card Pack</h2>
        <p>This is where the card pack will be displayed.</p>
         {/* ── Relative wrapper ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Card image with shake class */}
        <img
          src="/images/card.jpg"
          alt="Card"
          height={282}
          width={200}
          onClick={handleClick}
          className={shaking ? 'shake' : ''}
          style={{ cursor: 'pointer' }}
        />

{showPoof && (
  <img
    src="/images/poof.png"
    alt="poof"
    className="poof"
    style={{
      position: 'absolute',
      width: '500px',
      height: '600px',
      top: '-100px',
      left: '80%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      opacity: 1,
      animation: 'poofFade 0.8s ease-out forwards',
      zIndex: 1
    }}
  />
)}


      </div>

      <br/><br/>
      <button
        type="button"
        className="buttons"
        onClick={goToLoggedInPage}
      >
        Cards Page
      </button>
    </div>
  );
};

export default CardPack;