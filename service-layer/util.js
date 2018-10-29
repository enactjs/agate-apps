const calculateAverages = obj => {
    let result = []
    for (key in obj) {
      const average = obj[key].reduce((accum, curr) => accum + curr) / obj[key].length
      result.push({
        year: key,
        temperature: average,
      });
    }
    return result;
  }
  
  const extractKeys = array => {
    if (array.length === 0) {
      return [];
    }
    let keys = Object.keys(array[0]);
    let isCopy = array.every(element => {
      if (typeof element !== 'object') {
        throw new Error(`Array must be made entirely of objects`);
      }
      return Object.keys(element).every(key => keys.indexOf(key) !== -1);
    })
    if (isCopy) {
      return keys;
    } else {
      throw new Error(`Array's object's keys do not match`);
    }
  }
  
  const printQueryResults = array => {
    if (typeof array !== 'object') {
      console.log(array);
      return array;
    }
    if (!Array.isArray(array)) {
      array = [array]
    }
    let keys = extractKeys(array);
    let output = [];
    output.push(`\t${keys.join('\t')}`);
    array.forEach(row => {
      output.push(`\t${Object.keys(row).map(key => row[key]).join('\t')}`);
    });
    output = output.join('\n');
    console.log(output);
    return output;
  }
  
  const addClimateRowToObject = (row, obj) => {
    if (!obj[row.year]) {
      obj[row.year] = [];
    }
    obj[row.year].push(row.temp_avg);
    return obj;
  }
  
  const logNodeError = error => {
    if (error) {
      throw error;
    }
  }
  
  module.exports = {
    calculateAverages,
    printQueryResults,
    addClimateRowToObject,
    logNodeError
  }