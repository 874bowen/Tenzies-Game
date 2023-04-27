function Die({number, isHeld, holdDice}: any) {
   return (
      <div className="die-div" style={isHeld ?{backgroundColor: "green", color: "aliceblue", textShadow: "2px 1px 1px gray", boxShadow: "5px 5px 10px #0B2434"}: {}} onClick={holdDice}>
         {number}
      </div>
   )
}

export default Die;