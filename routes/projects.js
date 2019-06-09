var express = require("express");
var router = express.Router();
var bodyparser = require("body-parser");
var mysqlConnection = require("./mysqlConnection");

router.use(bodyparser.json());

// GET all projects
router.get("/", (req, res) => {
	mysqlConnection.query("SELECT * FROM projects", (err, rows, fields) => {
		if (!err) {
			res.send(rows);
		} else {
			res.send(err);
		}
	});
});

// GET one project
router.get("/:id", (req, res) => {
	mysqlConnection.query(
		"SELECT * FROM projects WHERE project_id = ?",
		[req.params.id],
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				res.send(err);
			}
		}
	);
});

// DELETE one project
router.delete("/:id", (req, res) => {
	mysqlConnection.query(
		"DELETE FROM projects WHERE project_id = ?",
		[req.params.id],
		(err, rows, fields) => {
			if (!err) {
				res.send("Delete successfully");
			} else {
				res.send(err);
			}
		}
	);
});

// INSERT A PROJECT
router.post("/", (req, res) => {
	let proj = req.body;
	var sql =
		"SET @project_id =?; SET @project_name =?; SET @project_date_start =?; \
	CALL ProjectAddOrEdit(@project_id, @project_name, @project_date_start);";
	mysqlConnection.query(
		sql,
		[proj.project_id, proj.project_name, proj.project_date_start],
		(err, rows, fields) => {
			if (!err) {
				rows.forEach(element => {
					if (element.constructor == Array) {
						res.send(
							"Inserted project id = " +
							element[0].project_id
						);
					}
				});
			} else {
				res.send(err);
			}
		}
	);
});

// UPDATE a project

router.put("/", (req, res) => {
	let proj = req.body;
	let sql = "SET @project_id =?; SET @project_name = ?; SET @project_start_date = ?; \
	CALL ProjectAddOrEdit(@project_id, @project_name, @project_start_date);";
	mysqlConnection.query(sql, [proj.project_id, proj.project_name, proj.project_start_date], (err, rows, fields) => {
	if(!err){
		res.send('Update successfully');
	}else {
		res.send(err);
	}
});
});

// PROCEDURE ProjectAddOrEdit for INSERT/EDIT a project in MySQL Workbench
// CREATE DEFINER=`root`@`localhost` PROCEDURE `ProjectAddOrEdit`(
// 	IN _project_id INT,
//     IN _project_name VARCHAR(50),
//     IN _project_date_start DATE
// )
// BEGIN
// 	IF _project_id = 0 THEN
// 		INSERT INTO projects(project_name, project_date_start)
//         VALUES(_project_name, _project_date_start);
        
//         SET _project_id = LAST_INSERT_ID();
// 	ELSE
// 		UPDATE projects
//         SET
//         project_name = _project_name,
//         project_date_start = _project_date_start
//         WHERE project_id = _project_id;
// 	END IF;
    
//     SELECT _project_id AS 'project_id';
    

// END

module.exports = router;
