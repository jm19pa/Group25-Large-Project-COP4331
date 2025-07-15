// create a function that automatically creates about ~20 or so card divs
import './cardDex.css'

function buildCards(owned: boolean){
    return Array.from({length:20}, (_, i) =>(
        <div className={`card ${owned ? '': 'card_disabled'}`} id={`card_${i}`} key={i}>
            <p>Card {i+1}</p>
        </div>
    ));
}


function DexPage(){
    return (
        <div className='page'>
            <div className='cardDex_container'>
                <h1 className='cardDex_title'>Professor Panel</h1>
                
                <h2>Owned Cards</h2>

                <div className="cardGrid">
                    {buildCards(true)}
                </div>

                <h2>Not yet Owned</h2>

                <div className="cardGrid">
                    {buildCards(false)}
                </div>
            </div>
        </div>

    )
}

export default DexPage;