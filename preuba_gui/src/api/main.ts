function fetch_data(handle:(obj:any)=>void){
    fetch('http://localhost:3000/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(handle)
        // .then(data => {
        //     console.log(data);
        // })
        .catch(error => {
            console.error('Error:', error.message);
        });
}
export default fetch_data;