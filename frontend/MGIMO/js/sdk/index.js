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
  return fetch(url)
       .then(r => {
         if (r.status === 200) {
           return r.json();
         }
         throw "err";
       });
}

export function get_tree() {
    let url = producer.get_tree();
    return fetch(url)
        .then(r => {
            if (r.status === 200) {
                return r.json();
            }
        });
}
