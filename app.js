async function getData() {
    try {
        const url = "http://127.0.0.1:5000/get_flower_data";    
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        data = await response.json();
        
        const combinedData = []

        data.MongoDB.flowers.forEach(res => {
            const flower = {
                database: data.MongoDB.database,
                ...res
            }
            combinedData.push(flower);
        });
        
        data.Neo4J.relationships.forEach(res => {
            const flower = {
                database: data.Neo4J.database,
                ...res
            }
            combinedData.push(flower);
        });

        Object.entries(data.Redis.inventory).forEach(([flowerName, res]) => {
            const flower = {
                database: data.Redis.database,
                flower: flowerName,
                ...res  
            }
            combinedData.push(flower);
        });

        data.SQL.flower_sales.forEach(res => {
            const flower = {
                database: data.SQL.database,
                ...res
            }
            combinedData.push(flower);
        });


          return combinedData;
       
    } catch (error) {
        console.error('Error:', error.message);
    }
    
}


(async () => {
    const lake = await getData();
    console.log('Lake:', lake);
})();




