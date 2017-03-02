const memorize = (fn, getKey = (data => JSON.stringify(data))) => {
    fn.memoize = fn.memoize || {};
    return arg => (
        (getKey(arg) in fn.memoize) ? fn.memoize[getKey(arg)] : (fn.memoize[getKey(arg)] = fn(arg))
    );
};

export default memorize;
