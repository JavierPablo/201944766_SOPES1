package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"math/rand/v2"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// db := get_db_instance()
	// // save_history_in_db(HistoryElm{
	// // 	cpu: 90,
	// // 	ram: 90,
	// // },*db)
	// retrieve_all_history_in_db(*db)
    // defer db.Close()
	main_program()
}

type ProcessInfo struct{
	Pid int
	Name string
	Childs []ProcessInfo
}

func main_program() {
	db := get_db_instance()
	process_info_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		

		data,ewrr:=io.ReadAll(r.Body)
		if ewrr!=nil{panic(ewrr)}
		var pid OnlyPid
		

		err:=json.Unmarshal(data, &pid)
		if err!=nil{return}
		fmt.Println(pid.Pid)
		ata:=make([]ProcessInfo,0,0)
		ata = append(ata, ProcessInfo{
			Pid:    70,
			Name:   "mucho",
			Childs: []ProcessInfo{ProcessInfo{
				Pid:    89,
				Name:   "otroultimo",
				Childs: []ProcessInfo{},
			}},
		})
		result:=ProcessInfo{
			Pid:    pid.Pid,
			Name:   "algopruebasd",
			Childs: ata,
		}
		js,err:=json.Marshal(result)
		
		if err!=nil{return}
		
		fmt.Fprint(w, string(js))
	}

	all_pids_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		result:=[]OnlyPid{OnlyPid{Pid: 5},OnlyPid{Pid:32},OnlyPid{Pid: 57},OnlyPid{Pid: 95},OnlyPid{Pid: 35}}
		js,err:=json.Marshal(result)
		if err!=nil{return}
		fmt.Fprint(w, string(js))
	}
	historical_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		result:=retrieve_all_history_in_db(*db)
		js,err:=json.Marshal(result)
		if err!=nil{return}
		fmt.Fprint(w, string(js))
	}
	realtime_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		rcs:=ResourceUsage{
			Cpu: rand.IntN(90),
			Ram: rand.IntN(90),
		}
		save_history_in_db(rcs,*db)
		js,err:=json.Marshal(rcs)
		if err!=nil{return}
		fmt.Fprint(w, string(js))
	}
	total_capacity_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		rcs:=ResourceUsage{
			Cpu: 100,
			Ram: 100,
		}
		js,err:=json.Marshal(rcs)
		if err!=nil{return}
		fmt.Fprint(w, string(js))
	}
	
	new_process_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		valid:=valid_pid_in_db(*db)
		fmt.Fprint(w, fmt.Sprintf(`{"Pid": %d}`,valid))
	}
	save_process_handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		data,ewrr:=io.ReadAll(r.Body)
		if ewrr!=nil{panic(ewrr)}
		var process_info ProcessOperation
		err:=json.Unmarshal(data, &process_info)
		if err!=nil{fmt.Println(err);return}
		save_process_in_db(process_info,*db)
		
	}

	http.HandleFunc("/all_pids", all_pids_handler)
	http.HandleFunc("/process_info", process_info_handler)
	http.HandleFunc("/historical", historical_handler)
	http.HandleFunc("/realtime", realtime_handler)
	http.HandleFunc("/capacity", total_capacity_handler)
	http.HandleFunc("/new_process", new_process_handler)
	http.HandleFunc("/save_op_process", save_process_handler)

	fmt.Println("Server is listening on :1200")
    defer db.Close()
	http.ListenAndServe(":1200", nil)
}



type ProcessOperation struct{
	Pid int
	Operation int
}
type ResourceUsage struct{
	Cpu int
	Ram int
}

func get_db_instance()*sql.DB{
	dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASS")
    dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/prueba_go",dbUser,dbPass, dbHost, dbPort)
	fmt.Println(dataSourceName)
	db, err := sql.Open("mysql", dataSourceName)
	// db, err := sql.Open("mysql", "JavierRoot:1667@tcp(127.0.0.1:3306)/prueba_go")
    // if there is an error opening the connection, handle it
    if err != nil {panic(err.Error())}
	return db
}





func save_process_in_db(process ProcessOperation,db sql.DB){
	_, err := db.Query(fmt.Sprintf("INSERT INTO process_op (pid, operation) VALUES ( %d, %d )",process.Pid,process.Operation))
    if err != nil {panic(err.Error())}
}
type OnlyPid struct{
	Pid int
}
func valid_pid_in_db(db sql.DB)int{
	fmt.Println("aquiiiiiiiiiiiiiiiii")
	results, err := db.Query("SELECT DISTINCT pid FROM process_op")
	fmt.Println("=====================")
    if err != nil {panic(err.Error())}
	all_data:=make([]OnlyPid,0,10)
    for results.Next() {
        var rs_us OnlyPid
        err = results.Scan(&rs_us.Pid)
        if err != nil { panic(err.Error()) }
        all_data = append(all_data, rs_us)
    }
	fmt.Println("888888888888888888888")
	contains:=func(list *([]OnlyPid),no int)bool{
		for i := 0; i < len(*list); i++ {
			if (*list)[i].Pid == no {
				return true
			}
		}
		return false
	}
	pid:=rand.IntN(999)
	for contains(&all_data,pid){
		pid=rand.IntN(999)
	}
	return pid
}



func save_history_in_db(elm ResourceUsage,db sql.DB){
	_, err := db.Query(fmt.Sprintf("INSERT INTO history (ram, cpu) VALUES ( %d, %d )",elm.Ram,elm.Cpu))
    if err != nil {panic(err.Error())}
}
func retrieve_all_history_in_db(db sql.DB)[]ResourceUsage{
	results, err := db.Query("SELECT ram, cpu FROM history")
    if err != nil {panic(err.Error())}
	all_data:=make([]ResourceUsage,0,10)
    for results.Next() {
        var rs_us ResourceUsage
        err = results.Scan(&rs_us.Ram, &rs_us.Cpu)
        if err != nil { panic(err.Error()) }
        all_data = append(all_data, rs_us)
    }
	fmt.Println("SUccesfullyretrived history")
	return all_data

}