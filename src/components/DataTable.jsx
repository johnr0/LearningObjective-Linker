import React, {Component} from 'react'
import {AgGridReact} from 'ag-grid-react';

class DataTable extends Component{

    onCellClicked(e){
        
        if(['not_yet_candidate'].indexOf(this.props.mother_state.action_state)!=-1){
            var colId = e.column.colId
            var rowId = e.data._id
            console.log(colId+'|'+rowId)
            if(this.props.mother_state.table_selection=='target2'||this.props.mother_state.table_selection=='condition2'){
                if(this.props.mother_state.selected_target_columns1.length==0 && this.props.mother_state.selected_condition_columns1.length==0){
                    alert('Please fill in the first target/condition')
                    return
                }
            }
            if(this.props.mother_state.table_selection=='target1' || this.props.mother_state.table_selection=='target2'){
                var selected_target_columns, other_selected_target_columns
                if(this.props.mother_state.table_selection=='target1'){
                    selected_target_columns = this.props.mother_state.selected_target_columns1
                    other_selected_target_columns = this.props.mother_state.selected_target_columns2
                }else{
                    selected_target_columns = this.props.mother_state.selected_target_columns2
                    other_selected_target_columns = this.props.mother_state.selected_target_columns1
                }
                var idx = selected_target_columns.indexOf(colId+'|'+rowId)
                console.log(colId+'|'+rowId, idx)
                if(idx==-1){
                    // // do not allow more than two targets
                    // if(selected_target_columns.length>=2){
                    //     alert('You cannot choose more than two targets. Please unselect one first.')
                    //     return
                    // }
                    // // do not allow target addition when there are two conditions and if this choosen one is out of them
                    // var condition_id_list = []
                    // for(var i in mother_state.selected_condition_columns){
                    //     if(condition_id_list.indexOf(selected_condition_columns[i].split('|')[1])==-1){
                    //         condition_id_list.push(selected_condition_columns[i].split('|')[1])
                    //     }
                    // }

                    // if(condition_id_list.length==2 && selected_target_columns.length==1){
                    //     var existing_data
                    //     var existing_colId = selected_target_columns[0].split('|')[0]
                    //     var existing_rowId = selected_target_columns[0].split('|')[1]
                    //     if(condition_id_list.indexOf(existing_rowId)!=-1 && condition_id_list.indexOf(rowId)==-1){
                    //         alert("Please choose targets that corresponds to the existing conditions.")
                    //         return
                    //     }else if(condition_id_list.indexOf(existing_rowId)!=-1 && condition_id_list.indexOf(rowId)!=-1 && existing_rowId==rowId){
                    //         alert("Please choose targets that corresponds to the existing conditions.")
                    //         return
                    //     }
                    // }else if(condition_id_list.length==2 && selected_target_columns.length==0){
                    //     if(condition_id_list.indexOf(rowId)==-1){
                    //         alert("Please choose targets that corresponds to the existing conditions.")
                    //         return
                    //     }
                    // }else if(condition_id_list.length==1 && selected_target_columns.length==1){
                    //     if(condition_id_list.indexOf(selected_target_columns[0].split('|')[1])==-1){
                    //         if(condition_id_list.indexOf(rowId)==-1){
                    //             alert("Please choose targets that corresponds to the existing conditions.")
                    //             return
                    //         }
                    //     }
                    // }
                    if(other_selected_target_columns.indexOf(colId+'|'+rowId)!=-1 || this.props.mother_state.selected_condition_columns1.indexOf(colId+'|'+rowId)!=-1 || this.props.mother_state.selected_condition_columns2.indexOf(colId+'|'+rowId)!=-1){
                        alert('You cannot choose the cell that is chosen as a condition.')
                        return
                    }
                    // prevent if types are different
                    if(selected_target_columns.length>=1){
                        var existing_data
                        var existing_colId = selected_target_columns[0].split('|')[0]
                        var existing_rowId = selected_target_columns[0].split('|')[1]
                        for (var i in this.props.mother_state.rowData){
                            var a_rowData = this.props.mother_state.rowData[i]
                            if(a_rowData._id==existing_rowId){
                                existing_data = a_rowData[existing_colId]
                                break
                            }
                        }
                        if(typeof(existing_data)!=typeof(e.value)){
                            alert('The type of the target is different from the already chosen one.')
                            return
                        }
                        if(typeof(existing_data)=='string'){
                            alert('The range only applies to numerical targets.')
                            return
                        }
                    }
                    if(other_selected_target_columns.length>=1){
                        var existing_data
                        var existing_colId = other_selected_target_columns[0].split('|')[0]
                        var existing_rowId = other_selected_target_columns[0].split('|')[1]
                        for (var i in this.props.mother_state.rowData){
                            var a_rowData = this.props.mother_state.rowData[i]
                            if(a_rowData._id==existing_rowId){
                                existing_data = a_rowData[existing_colId]
                                break
                            }
                        }
                        if(typeof(existing_data)!=typeof(e.value)){
                            alert('The type of the target is different from the already chosen one.')
                            return
                        }
                    }
                    selected_target_columns.push(colId+'|'+rowId)
                }else{
                    selected_target_columns.splice(idx, 1)
                }
            }else if(this.props.mother_state.table_selection=='condition1' || this.props.mother_state.table_selection=='condition2'){
                var selected_condition_columns, other_selected_condition_columns
                if(this.props.mother_state.table_selection=='condition1'){
                    selected_condition_columns = this.props.mother_state.selected_condition_columns1
                    other_selected_condition_columns = this.props.mother_state.selected_condition_columns2
                }else{
                    selected_condition_columns = this.props.mother_state.selected_condition_columns2
                    other_selected_condition_columns = this.props.mother_state.selected_condition_columns1
                }
                
                var idx = selected_condition_columns.indexOf(colId+'|'+rowId)
                var target_row_ids = []
                var condition_row_ids = []
                var all_row_ids = []
                for(var i in selected_target_columns){
                    var item = selected_target_columns[i]
                    var n_rowId = item.split('|')[1]
                    if(target_row_ids.indexOf(n_rowId)==-1){
                        target_row_ids.push(n_rowId)
                    }
                    if(all_row_ids.indexOf(n_rowId)==-1){
                        all_row_ids.push(n_rowId)
                    }
                }
                for(var i in selected_condition_columns){
                    var item = selected_condition_columns[i]
                    var n_rowId = item.split('|')[1]
                    if(condition_row_ids.indexOf(n_rowId)==-1){
                        condition_row_ids.push(n_rowId)
                    }
                    if(all_row_ids.indexOf(n_rowId)==-1){
                        all_row_ids.push(n_rowId)
                    }
                }
                

                if(idx==-1){
                    // if(all_row_ids.length>=2 && all_row_ids.indexOf(rowId)==-1){
                    //     alert('Please choose the condition that falls within either the existing targets or already chosen conditions.')
                    //     return
                    // }
                    if(other_selected_condition_columns.indexOf(colId+'|'+rowId)!=-1 || this.props.mother_state.selected_target_columns1.indexOf(colId+'|'+rowId)!=-1 || this.props.mother_state.selected_target_columns2.indexOf(colId+'|'+rowId)!=-1){
                        alert('You cannot choose the cell that is chosen as a target.')
                        return
                    }
                    // if(target_row_ids.length==1 && this.props.mother_state.selected_target_columns.length==2){
                    //     if(target_row_ids.indexOf(rowId)==-1){
                    //         alert('Please choose the condition that falls within either the existing targets or already chosen conditions.')
                    //         return
                    //     }
                    // }
                    selected_condition_columns.push(colId+'|'+rowId)
                }else{
                    selected_condition_columns.splice(idx, 1)
                }
            }
            var nrd = JSON.parse(JSON.stringify(this.props.mother_state.rowData))
            var nrow = JSON.parse(JSON.stringify(nrd[nrd.length-1]))
            nrow['_id']='n'
            nrd.push(nrow)
            console.log(this.props.mother_state.selected_target_columns1)
            var _this = this
            this.props.mother_this.setState({rowData: nrd}, function(){
                _this.props.mother_state.rowData.splice(_this.props.mother_state.rowData.length-1, 1)
                var nrd = JSON.parse(JSON.stringify(_this.props.mother_state.rowData))
                _this.props.mother_this.setState({rowData:nrd}, function(){
                    // _this.props.mother_this.generate_candidate_statements()
                    _this.props.mother_this.refreshTable()
                })
            })
        }
        
    }

    render(){

        var gridOptions = {
            onCellClicked: this.onCellClicked.bind(this)
        }
        return (<div style={{height:'100%', padding:'20px'}}>
            <AgGridReact
                columnDefs={this.props.mother_state.columnDefs}
                rowData={this.props.mother_state.rowData}
                className={'ag-theme-balham'}
                gridOptions={gridOptions}
                >
            </AgGridReact>
        </div>)
    }
}

export default DataTable;