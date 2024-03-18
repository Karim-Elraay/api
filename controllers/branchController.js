
const { client } = require("../config/dbConfig");


const addNew =async (req, res) => {
    try {
        console.log(req.body);
        const { branchName, branchAddress, branchPhone } = req.body || {}; // Destructuring
        if (!branchName || !branchAddress || !branchPhone) {
            // Check for required fields
            throw new Error("Missing required fields , please enter all the data");
        }
        const phoneCheckQuery = "SELECT branch_name FROM branches WHERE branch_phone = $1";
        const phoneCheckValues = [branchPhone];

        const phoneCheckResult = await client.query(phoneCheckQuery, phoneCheckValues);

        if (phoneCheckResult.rows.length > 0) {
            const existingBranchName = phoneCheckResult.rows[0].branch_name;
            res.status(409).send(
                `can not use this number for ${branchName} branch because it is already used by branch: ${existingBranchName}`
            );
            return; // Exit the function if phone exists
        }

        const query = "SELECT fn_add_branch($1, $2, $3)";
        const values = [branchName, branchAddress, branchPhone];

        await client.query(query, values);

        res.status(201).send("Data inserted successfully");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error: " + error.message); // Informative error message
    }
}

module.exports = {
    addNew
}