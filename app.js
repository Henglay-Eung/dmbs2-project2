async function getData() {
    try {
        const url = "http://127.0.0.1:5000/get_flower_data";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const combinedData = [];

        // Extracting MongoDB data
        data.MongoDB.flowers.forEach(res => {
            const flower = {
                database: data.MongoDB.database,
                ...res
            };
            combinedData.push(flower);
        });

        // Extracting Neo4J data
        data.Neo4J.relationships.forEach(res => {
            const flower = {
                database: data.Neo4J.database,
                ...res
            };
            combinedData.push(flower);
        });

        // Extracting Redis data
        Object.entries(data.Redis.inventory).forEach(([flowerName, res]) => {
            const flower = {
                database: data.Redis.database,
                flower: flowerName,
                ...res
            };
            combinedData.push(flower);
        });

        // Extracting SQL data
        data.SQL.flower_sales.forEach(res => {
            const flower = {
                database: data.SQL.database,
                ...res
            };
            combinedData.push(flower);
        });

        return combinedData;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

(async () => {
    // Retrieve data lake
    const lake = await getData();
    console.log('Lake:', lake);

    // Transform data lake into warehouse by Harsh Bhanushali
    const warehouse = lake
        .map(entry => entry.zip_code) // Extract zip codes
        .filter((zip, index, self) => zip && self.indexOf(zip) === index) // Get unique zip codes
        .reduce((acc, zip) => {
            const count = lake.filter(entry => entry.zip_code === zip).length; // Count occurrences per zip
            acc[zip] = { zip_code: zip, count }; // Add to warehouse
            return acc;
        }, {});

    console.log('Warehouse:', warehouse);
})();
