import React, {useState} from 'react';

const CardPack: React.FC = () => {
  // some logic
  const [bouncing, setBouncing] = useState(false);
  function handleClick() {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 500); // remove class after animation
  }
    function goToLoggedInPage() {
        window.location.href = '/cards';
    }
  return (
    <div>
        <h2>Card Pack</h2>
        <p>This is where the card pack will be displayed.</p>
        <div>
            <img
                src="/images/card.jpg"
                alt="Card"
                height="282"
                width="200"
                className={bouncing ? "bounce" : ""}
                onClick={handleClick}
                style={{ cursor: "pointer" }}
            />
            <br></br>
            <br></br>
            <button type="button" id="Register" className="buttons"
                onClick={goToLoggedInPage}> Cards Page </button>

        </div>
    </div>
  );
};

export default CardPack;