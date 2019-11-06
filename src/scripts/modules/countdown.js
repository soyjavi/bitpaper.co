const ticker = (targetTime, callback) => {
  const distance = targetTime - new Date().getTime();
  let values = {};

  if (distance > 0) {
    values = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }

  callback(values);
};

export default (target, callback) => {
  if (!target) return;

  const targetTime = new Date(target).getTime();
  ticker(targetTime, callback);
  setInterval(() => ticker(targetTime, callback), 1000);
};
