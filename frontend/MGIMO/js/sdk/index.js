import producer from './producer';

export function register(data) {
  let url = producer.register(data);
  return fetch(url)
       .then(r => {
         if (r.status === 200) {
           return r.json();
         }
         throw "err";
       });
}

export function get_timetable(data) {
  let url = producer.get_timetable(data);
  console.log('URL TIMETABLE', url);
  return fetch(url)
       .then(r => {
         console.log('TIMETABLE RESULT', r);
         if (r.status === 200) {
           return r.json();
         }
         throw "err";
       });
}
