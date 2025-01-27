// 2.12* Data for countries, step1

const Filter = ({ handler }) => {
    return (
        <div>
            find countries <input onChange={handler} />
        </div>
    );
};

export default Filter;