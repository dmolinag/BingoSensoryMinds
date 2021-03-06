import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import Confetti from 'react-confetti'
import UIfx from 'uifx'

// Style
import './MainContent.css'
import 'antd/dist/antd.css';

// Data
import { slots, positions } from '../data/data'
import bingo from "../assets/bingo.png"
import chickenWinner from "../assets/chickenWinner.png"
import winnerBell from "../assets/winnerBell.flac"

const bell = new UIfx(
   winnerBell,
)

class MainContent extends Component {

   constructor(props) {
      super(props);

      this.state = {
         slotsArray: [],
         checkedSlotsArray: [{
            id: 13,
            text: "REMEMBER YOUR BINGO MASK!",
            selected: false,
            x: 3,
            y: 3
         }],
         winner: false,
         height: 0,
         width: 0
      }
   }

   componentDidMount() {
      const newSlotsArray = this.shuffleAndSetRandomPosition()

      this.setState({
         slotsArray: newSlotsArray
      })
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
   }

   // Functions
   updateWindowDimensions = () => {
      this.setState({
         height: window.innerHeight,
         width: window.innerWidth
      });
   }

   shuffleAndSetRandomPosition = () => {
      const positionsrandom = positions.sort(() => Math.random() - 0.5)
      const slotsArray = slots;

      for (let i = 0; i < positionsrandom.length; i++) {
         slotsArray[i].x = positionsrandom[i].x
         slotsArray[i].y = positionsrandom[i].y
         slotsArray[i].number = positionsrandom;
      }

      const newArray = slotsArray

      return newArray
   }

   validateBingo = (checkedSlotsArray) => {
      let winnerRow = []
      let winner = false

      // Validate row and column winner
      for (let i = 1; i <= 5; i++) {
         winnerRow = checkedSlotsArray.filter(slot => slot.x === i);

         if (winnerRow.length === 5) {
            winner = true
            break;
         }

         winnerRow = checkedSlotsArray.filter(slot => slot.y === i);

         if (winnerRow.length === 5) {
            winner = true
            break;
         }

         winnerRow = checkedSlotsArray.filter(slot => (
            (slot.x === 1 && slot.y === 1) ||
            (slot.x === 2 && slot.y === 2) ||
            (slot.x === 3 && slot.y === 3) ||
            (slot.x === 4 && slot.y === 4) ||
            (slot.x === 5 && slot.y === 5)
         ));

         if (winnerRow.length === 5) {
            winner = true
            break;
         }

         winnerRow = checkedSlotsArray.filter(slot => (
            (slot.x === 5 && slot.y === 1) ||
            (slot.x === 4 && slot.y === 2) ||
            (slot.x === 3 && slot.y === 3) ||
            (slot.x === 2 && slot.y === 4) ||
            (slot.x === 1 && slot.y === 5)
         ));

         if (winnerRow.length === 5) {
            winner = true
            break;
         }
      }

      this.setState({
         winner
      })

      if (winner) {
         bell.play()
      }
   }

   // Events
   clickSlot = (xPosition, yPosition) => {
      const { slotsArray } = { ...this.state }
      const { checkedSlotsArray } = { ...this.state }

      slotsArray.forEach(slot => {
         if (slot.x === xPosition && slot.y === yPosition) {
            if (!slot.selected) {
               slot.selected = true
               checkedSlotsArray.push(slot)
            } else {
               slot.selected = false
               for (let i = 0; i < checkedSlotsArray.length; i++) {
                  if (checkedSlotsArray[i].id === slot.id) {
                     checkedSlotsArray.splice(i, 1);
                     break;
                  }
               }
            }
         }
      })

      this.setState({
         slotsArray,
         checkedSlotsArray
      })

      if (checkedSlotsArray.length > 3) {
         this.validateBingo(checkedSlotsArray)
      }
   }

   restart = () => {
      const randomSlots = this.shuffleAndSetRandomPosition()

      randomSlots.forEach(obj => obj.selected = false)

      this.setState({
         slotsArray: randomSlots,
         checkedSlotsArray: [
            {
               id: 13,
               text: "REMEMBER YOUR BINGO MASK!",
               selected: false,
               x: 3,
               y: 3
            }
         ],
         winner: false
      })
   }

   // Info to render
   renderHeader = () => {
      const columns = 5;
      const slotsRow = [];
      let letter = null;

      for (let slot = 1; slot <= columns; slot++) {
         switch (slot) {
            case 1:
               letter = "B";
               break;
            case 2:
               letter = "I";
               break;
            case 3:
               letter = "N";
               break;
            case 4:
               letter = "G";
               break;
            default:
               letter = "O";
               break;
         }
         const rowSlot =
            <th
               key={slot}
               className="headerSlot"
            >
               <h3>
                  {letter}
               </h3>
            </th>

         slotsRow.push(rowSlot)
      }
      return slotsRow
   }

   renderSlots = () => {
      const { slotsArray } = this.state
      const maxRows = 5;
      const maxColumns = 5;
      const bingoCard = [];

      // Print all the slots to show the Bingo card
      for (let row = 1; row <= maxRows; row++) {
         const bingoCardRow = [];
         for (let column = 1; column <= maxColumns; column++) {

            const slotInfo = slotsArray.filter(slot => slot.x === row && slot.y === column)
            let slot = null;

            if (slotInfo[0].x !== 3 || slotInfo[0].y !== 3) {
               slot =
                  <td
                     key={slotInfo[0].id}
                     className={slotInfo[0].selected ? "checkedSlot" : "slotNotChecked"}
                     onClick={() => this.clickSlot(row, column)}
                  >
                     <div className="row slot">
                        {slotInfo[0].text}
                        <p className="row slotNumber">{slotInfo[0].id}</p>
                     </div>
                  </td>
            } else {
               slot =
                  <td
                     key={slotInfo[0].id}
                     className="centralSlot"
                  >
                     <div className="row slot">
                        {slotInfo[0].text}
                        <p className="row slotNumber">{slotInfo[0].id}</p>
                     </div>
                  </td>
            }

            bingoCardRow.push(slot)
         }
         bingoCard.push(<tr key={row}>{bingoCardRow}</tr>)
      }
      return bingoCard;
   }

   render() {
      const { slotsArray, winner, height, width } = this.state
      return (
         <div className='bingo'>
            {
               winner &&
               <Confetti
                  width={width}
                  height={height}
                  wind={0.05}
                  recycle
                  run
               />
            }

            <Modal
               centered
               visible={winner}
               footer={[
                  <Button key="back" onClick={() => this.restart()}>
                     Ok
                  </Button>
               ]}
               onOk={() => this.restart()}
               onCancel={() => this.restart()}
            >
               <div style={{ textAlign: "center" }}>
                  <img src={chickenWinner} alt={"Winner"} />
                  <h2 className="winnerMessage">You have won our magnificent BINGO!</h2>
               </div>
            </Modal>

            <div className="row">
               <img src={bingo} width={"80%"} height={"150px"} alt={"Bingo"} />
            </div>

            {
               slotsArray.length > 0 &&
               /* Bingo card */
               <div className="row bingoCard">
                  <table className="table">
                     <thead>
                        {this.renderHeader()}
                     </thead>
                     <tbody>
                        {this.renderSlots()}
                     </tbody>
                  </table>
               </div>
            }

            <div className="row restartButton">
               <div className="col-11">
                  <Button type="primary" onClick={this.restart}>Restart</Button>
               </div>
               <div className="col-1">
                  Sound up
               </div>
            </div>
         </div>
      );
   }
}

export default MainContent;
