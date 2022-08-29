const convertTimestamp = (timestamp, format) => {
  if(timestamp) {
    let date1 = timestamp.toDate();
    let mm = date1.getMonth() + 1;
    let dd = date1.getDate();
    let yyyy = date1.getFullYear();
    date1 = mm + '/' + dd + '/' + yyyy;
    const date2 = (new Date(timestamp.seconds * 1000)).toLocaleString('en-us', { year:'numeric', month:'short', day:'numeric'});
    const time = (new Date(timestamp.seconds * 1000)).toLocaleString('en-us', { hour: 'numeric', minute: 'numeric', hour12: true });

    switch (format) {
      case 'messageFormat':
        return `${date1} ${time}`;
      case 'userFormat':
        return date2;
      default:
        return date2
    }
  }
}

export { convertTimestamp };
