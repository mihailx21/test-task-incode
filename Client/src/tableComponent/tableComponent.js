import React from "react"

const styles ={
    td: {
        padding: "0.5rem 1rem"
    },
    th: {
        padding: "0.5rem 1rem" 
    }
}

function Table(props){
    function arrow(name){
        let newPrice = props.position.price;
        let prevData = props.oldData;
        let finalArrow, oldPrice;
        
        prevData.forEach(element => {
            if(element.ticker === name){
                oldPrice = element.price;
            }
        });

        if(newPrice > oldPrice)
            finalArrow = "\u2191";
        else if(newPrice < oldPrice)
            finalArrow = "\u2193";
        else
            finalArrow = "";        
        return finalArrow;
    }

    let arrowDir =  arrow(props.position.ticker);
    let directionChange;
    if (arrowDir === "\u2191")
        directionChange = "+";
    else if(arrowDir === "\u2193")
        directionChange = "-";
    else
        directionChange = "";

    return(
            <tr>
                <th style={styles.th}>{ props.getTrueName(props.position.ticker) }</th>
                <td style={styles.td}>{ props.position.price + " $"}</td>
                <td style={styles.td}>{ directionChange + props.position.change + "$" }</td>
                <td style={styles.td}>{ arrowDir + " " + props.position.change_percent + " %" }</td>
                <td style={styles.td}><button className="remove-button" onClick={ ()=>props.removeItem(props.position.ticker) }>&times;</button></td>
            </tr>
    )
}

export default Table