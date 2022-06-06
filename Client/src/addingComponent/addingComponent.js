import React from "react";

const styles = {
    button: {
        marginLeft: "5px"
    },
    td:{
        justifyContent: "center",
        textAlign: "center",
        wight: "100%"
    }
    
}

function DataListDynamic(props){
    return(
        <tr>
            <td style={styles.td} colSpan="5">
                <input id="inputList" type="text" list="add-item" placeholder="Only deleted tickers"/>
                <datalist id="add-item">
                    {
                    props.names.map((el)=><option value={props.getTrueName(el)} key={el}/>)
                    }
                </datalist>
                <button style={styles.button} onClick={ ()=>{props.addItem()} }>&#43;</button>
            </td>
        </tr>

    );
}

export default DataListDynamic