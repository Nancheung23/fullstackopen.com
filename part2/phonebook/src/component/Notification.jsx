const Notification = ({ message, activated }) => {
    if (message === null) {
        return null;
    };
    const name = activated ? 'notify' : 'none';
    return (
        <div className={name}>
            {message}
        </div>
    )
};

export default Notification;