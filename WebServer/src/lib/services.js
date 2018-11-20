import axios from 'axios';

export function getTitle(id) {

    return axios.get('http://taekhoon.tk:9999/api/title/' + id);
}

export function getContent(id) {
    return axios.get('http://taekhoon.tk:9999/api/plug/' + id);
}

export function getAllContent() {
  return axios.get('http://taekhoon.tk:9999/api/plug');
}

export function putPermission(target) {
  // console.log(target);
  return axios.get('http://taekhoon.tk:9999/api/plug/allow/' +target);
}

export function putButton(target, num) {
    console.log(target + "," + num);
    return axios.get('http://taekhoon.tk:9999/api/plug/send/'+target+'/'+num);
  // return axios({
  //   method: 'post',
  //   url: 'http://220.68.231.112:9999/api/plug/send/'+target+'/'+num,
  //   params: {
  //     id: target,
  //     button: num,
  //     PERMISSION : 1
  //   }
  // });
}
