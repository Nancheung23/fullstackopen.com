// 2.10: The Phonebook Step5
import React from "react";

const PersonForm = (
    { name, number, nameHandler, numberHandler, submit }
) => {
    return (
        <form onSubmit={submit}>
            <div>
                name: <input value={name} onChange={nameHandler} />
            </div>
            {/* 2.8: The Phonebook Step3 */}
            <div>
                number: <input value={number} onChange={numberHandler} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

export default PersonForm;