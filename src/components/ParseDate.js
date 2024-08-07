const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = monthNames.indexOf(month);
    return new Date(year, monthIndex, day);
  };

  export default parseDate;