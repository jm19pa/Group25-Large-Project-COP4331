import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './cardDex.css';

function buildCards(owned: boolean, cardFilenames: string[]) {
    return cardFilenames.map((filename, i) => (
        <div
            className={`card ${owned ? '' : 'card_disabled'}`}
            id={`card_${i}`}
            key={i}
        >
            <img
                src={`/images/${filename}`}
                alt={`Card ${i}`}
                className="card-img"
            />
        </div>
    ));
}


function DexPage(){

    const [ownedCards, setOwnedCards] = useState<string[]>([]);
    const [unownedCards, setUnownedCards] = useState<string[]>([]);
    const navigate = useNavigate();

    // const cardFilenames = Array.from({ length: 44 }, (_, i) => `card_${i}.png`);
    
    useEffect(() => {
        const fetchCards = async() => {
            const userID = localStorage.getItem("user_data");
            const jwtToken = localStorage.getItem("token_data");

            if(!userID || !jwtToken){
                console.error("Missing userID or token for card dex");
                navigate('/register');
                return;
            }

            try{
                const ownedRes = await fetch("http://pocketprofessors.com:5000/api/foundCards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({userID, jwtToken}),
                });

                const ownedData = await ownedRes.json();

                if(!ownedData.error){
                    setOwnedCards(ownedData.cards);
                    console.log("Owned cards data: ", ownedCards);
                    localStorage.setItem("token", ownedData.jwtToken);
                }
                else{
                    console.error("Owned cards error: ", ownedData.error);
                }

                const unownedRes = await fetch("http://pocketprofessors.com:5000/api/unfoundCards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({userID, jwtToken}),
                });

                const unownedData = await unownedRes.json();

                if(!unownedData.error){
                    setUnownedCards(unownedData.missingCards);
                    localStorage.setItem("token", unownedData.jwtToken);
                }
                else{
                    console.error("Unowned cards error: ", unownedData.error);
                }                

                console.log("ownedCards: ", ownedCards);
                console.log("unownedCards: ", unownedCards);

                console.log("ownedData.jwtToken: ", ownedData.jwtToken);
                console.log("unownedData.jwtToken: ", unownedData.jwtToken);

                console.log("ownedData.cards: ", ownedData.cards);
                console.log("unownedData.missingCards: ", unownedData.missingCards);
            }
            catch (err){
                console.error("API call failed: ", err);
            }
        };

        fetchCards();
    }, [navigate])

    return (
        <div className='page'>
            <div className='cardDex_container'>
                <h1 className='cardDex_title'>Professor Panel</h1>
                
                <h2>Owned Cards</h2>

                <div className="cardGrid">
                    {buildCards(true, ownedCards)}
                </div>

                <h2>Not yet Owned</h2>

                <div className="cardGrid">
                    {buildCards(false, unownedCards)}
                </div>
            </div>
        </div>

    )
}

export default DexPage;

// function DexPage(){
//     const [ownedCards, setOwnedCards] = useState<string[]>([]);
//     const [unownedCards, setUnownedCards] = useState<string[]>([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCards = async () => {
//             const userID = localStorage.getItem("userID");
//             const jwtToken = localStorage.getItem("token");

//             if(!userID || !jwtToken){
//                 console.error("Missing userID or token for card Dex");
//                 navigate('/register');
//                 return;
//             }

//             try{
//                 const ownedRes = await fetch("http://pocketprofessors.com:5000/api/foundCards", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({userID,jwtToken}),
//                 });

//                 const ownedData = await ownedRes.json();

//                 if(!ownedData.error){
//                     setOwnedCards(ownedData.cards);
//                     localStorage.setItem("token", ownedData.jwtToken);
//                 }
//                 else{
//                     console.error("Owned cards error: ", ownedData.error);
//                 }

//                 const unownedRes = await fetch("http://pocketprofessors.com:5000/api/unfoundCards", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({userID,jwtToken}),
//                 });

//                 const unownedData = await unownedRes.json()

//                 if(!unownedData.error){
//                     setUnownedCards(unownedData.missingCards);
//                     localStorage.setItem("token", unownedData.jwtToken);
//                 }
//                 else{
//                     console.error("Unowned cards error: ", unownedData.error);
//                 }
//             }
//             catch (err){
//                 console.error("API call failed: ", err)
//             }
//         };

//         fetchCards();
//     }, [navigate]);

//     return (
//         <div className='page'>
//             <div className='cardDex_container'>
//                 <h1 className='cardDex_title'>Professor Panel</h1>

//                 <h2>Owned Cards</h2>
//                 <div className="cardGrid">
//                     {buildCards(ownedCards, true)}
//                 </div>

//                 <h2>Not yet Owned</h2>
//                 <div className="cardGrid">
//                     {buildCards(unownedCards, false)}
//                 </div>
//             </div>
//         </div>
//     );
// }


// export default DexPage;