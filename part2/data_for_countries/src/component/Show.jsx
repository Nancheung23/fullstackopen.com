const Show = ({ name, handler }) => {
    return (
        <>
            <p>
                {name} &nbsp;
                <button onClick={handler}>show</button>
            </p>
        </>
    );
};

export default Show;