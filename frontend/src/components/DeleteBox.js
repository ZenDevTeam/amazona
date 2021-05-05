import React from 'react';
import '../styles/Box.css';
export default function DeleteBox({ onCancelDelete, deleteHandler, deleteID}) {
    

    return (
        <div className="modal" >
            
            <form className="modal-content form" >
                <h3>Do you want to remove this row</h3>
                <button onClick={(e) => deleteHandler(e, deleteID)}>Yes</button>
                <button onClick={(e) => onCancelDelete(e)}>No</button>
            </form>
        </div>
    );
}