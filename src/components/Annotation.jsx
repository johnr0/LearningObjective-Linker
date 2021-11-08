import React, {Component} from 'react'

class Annotation extends Component{
    startSelecting(){
        this.props.mother_this.setState({action_state: 'to_select_text'})
    }

    cancelSelecting(){
        var _this = this
        if(this.props.mother_state.selected_list!=false){
            delete this.props.mother_state.list[this.props.mother_state.selected_list]
        }
        this.props.mother_this.setState({
            selected_list:false, 
            action_state: 'idle',
            table_selection:'target',
            selected_target_columns: [],
            selected_condition_columns: [],
            selected_query_type: '', 
            query: '',
            selected_target_indexes: [],
            selected_condition_indexes: [],
            selected_query_index: undefined,
            cur_query_index: undefined, 
            candidate_statements: 'none', 
            candidate_option_single_target: 'nonrank', 
            candidate_option_double_target: 'nonratio', 

        }, function(){
            _this.props.mother_this.refreshTable()
        })
    }

    goBackToCandidateSelection(){
        var _this = this
        this.props.mother_this.setState({
            action_state: 'not_yet_candidate',
            selected_target_indexes: [],
            selected_condition_indexes: [],
            selected_query_index: undefined,
            cur_query_index: undefined, 

        }, function(){
            _this.props.mother_this.refreshTable()
        })
    }

    editSelectedStatement(){
        var value = document.getElementById('statement_list').value
        if(value!=undefined){
            var sqi = this.props.mother_state.list[value].selected_query_index
            if(sqi!=undefined){
                sqi = JSON.parse(JSON.stringify(sqi))
            }
            var _this = this
            this.props.mother_this.setState({
                selected_list:value, 
                action_state: 'to_link_text',
                table_selection:'target',
                selected_target_columns: JSON.parse(JSON.stringify(this.props.mother_state.list[value].selected_target_columns)),
                selected_condition_columns: JSON.parse(JSON.stringify(this.props.mother_state.list[value].selected_condition_columns)),
                selected_query_type: this.props.mother_state.list[value].selected_query_type, 
                query: this.props.mother_state.list[value].query,
                selected_target_indexes: JSON.parse(JSON.stringify(this.props.mother_state.list[value].selected_target_indexes)),
                selected_condition_indexes: JSON.parse(JSON.stringify(this.props.mother_state.list[value].selected_condition_indexes)),
                selected_query_index: sqi,
                cur_query_index: undefined, 
                candidate_statements: 'none', 
                candidate_option_single_target: 'nonrank', 
                candidate_option_double_target: 'nonratio', 
    
            }, function(){
                _this.props.mother_this.refreshTable()
            })
        }
    }

    renderList(){
        return Object.keys(this.props.mother_state.list).map((val, idx)=>{
            return (<option value={val} key={val}>
                {this.props.mother_state.list[val].chosen_text}
            </option>)
        })
    }

    chooseTableSelectionMethod(method){
        this.props.mother_this.setState({table_selection :method})
    }

    chooseCandidate(idx){
        var nrd = JSON.parse(JSON.stringify(this.props.mother_state.rowData))
        var nrow = JSON.parse(JSON.stringify(nrd[nrd.length-1]))
        nrow['_id']='n'
        nrd.push(nrow)
        var _this = this
        if(this.props.mother_state.candidate_selected!=idx){
            
            this.props.mother_this.setState({candidate_selected:idx,rowData: nrd}, function(){
                _this.props.mother_state.rowData.splice(_this.props.mother_state.rowData.length-1, 1)
                var nrd = JSON.parse(JSON.stringify(_this.props.mother_state.rowData))
                _this.props.mother_this.setState({rowData:nrd}, function(){
                    // _this.props.mother_this.generate_candidate_statements()
                })
            })
        }else{
            this.props.mother_this.setState({candidate_selected:-1,rowData: nrd}, function(){
                _this.props.mother_state.rowData.splice(_this.props.mother_state.rowData.length-1, 1)
                var nrd = JSON.parse(JSON.stringify(_this.props.mother_state.rowData))
                _this.props.mother_this.setState({rowData:nrd}, function(){
                    // _this.props.mother_this.generate_candidate_statements()
                })
            })
        }
        
    }

    renderCandidates(){
        return this.props.mother_state.candidate_statements.map((val, idx)=>{
            var backgroundColor
            if(this.props.mother_state.candidate_selected==idx){
                backgroundColor = '#888888'
            }else{
                backgroundColor=''
            }
            return (<div value={'candidate_'+idx.toString()} key={'candidate_'+idx.toString()} onClick={this.chooseCandidate.bind(this, idx)}
                style={{backgroundColor:backgroundColor}}>
                {val[0]}
            </div>)
        })
    }

    single_target_change_canditype(){
        var _this = this
        if(this.props.mother_state.candidate_option_single_target=='rank'){
            this.props.mother_this.setState({candidate_option_single_target: 'nonrank', candidate_selected:-1}, function(){
                _this.props.mother_this.generate_candidate_statements()
                _this.props.mother_this.refreshTable()
            })
        }else{
            this.props.mother_this.setState({candidate_option_single_target: 'rank', candidate_selected:-1}, function(){
                _this.props.mother_this.generate_candidate_statements()
                _this.props.mother_this.refreshTable()
            })
        }
    }

    double_target_change_canditype(){
        var _this = this
        if(this.props.mother_state.candidate_option_double_target=='ratio'){
            this.props.mother_this.setState({candidate_option_double_target: 'nonratio'}, function(){
                _this.props.mother_this.generate_candidate_statements()
                _this.props.mother_this.refreshTable()
            })
        }else{
            this.props.mother_this.setState({candidate_option_double_target: 'ratio'}, function(){
                _this.props.mother_this.generate_candidate_statements()
                _this.props.mother_this.refreshTable()
            })
        }
    }

    candidate_confirm(){
        if(typeof(this.props.mother_state.candidate_statements)!='string'){
            var item = this.props.mother_state.candidate_statements[this.props.mother_state.candidate_selected]
            var _this = this
            console.log(item)
            this.props.mother_this.setState({action_state:'candidate_selected', 
                query: item[0], 
                selected_condition_columns: item[1], 
                selected_target_columns: item[2], 
                selected_query_type: item[3],
                selected_condition_indexes: Array.apply(null, Array(item[1].length)).map(function () {}),
                selected_target_indexes: Array.apply(null, Array(item[2].length)).map(function () {}),
                selected_query_index: undefined, 
            }, 
            function(){
                _this.props.mother_this.refreshTable()
            })
        }
        
    }

    selectLinker(selected){
        if(this.props.mother_state.action_state!='to_link_text'){
            this.props.mother_this.setState({action_state:'to_link_text', cur_query_index: selected})
        }else{
            this.props.mother_this.setState({action_state:'candidate_selected', cur_query_index: undefined})
        }
        
    }

    linkingDown(){
        if(this.props.mother_state.action_state=='to_link_text'){
            this.props.mother_this.setState({action_state:'linking_text'})
        }
    }

    linkingUp(){
        if(this.props.mother_state.action_state=='linking_text'){
            var chosen_part = window.getSelection()
            var chosen_text = chosen_part.toString()
            var start;
            var end;
            if(chosen_part.baseOffset>chosen_part.focusOffset){
                start = chosen_part.baseOffset-chosen_text.length
                end = chosen_part.baseOffset
            }else{
                start = chosen_part.baseOffset
                end = chosen_part.baseOffset+chosen_text.length
            }
            console.log(chosen_part, 'chosen')
            console.log(start, end)   

            if(chosen_text!=''){
                var _id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);

                var new_item = {start:start, end:end}
                var type = this.props.mother_state.cur_query_index.split('_')[0]
                var _idx = parseInt(this.props.mother_state.cur_query_index.split('_')[1])
                if(type == 'target'){
                    this.props.mother_state.selected_target_indexes[_idx] = new_item
                }else if(type == 'condition'){
                    this.props.mother_state.selected_condition_indexes[_idx] = new_item
                }else{
                    this.props.mother_state.selected_query_index = new_item
                }
                
                this.props.mother_this.setState({action_state:'to_link_text', cur_query_index: undefined})
            }
            
        }
    }

    linkingOut(){
        if(this.props.mother_state.action_state=='linking_text'){
            this.props.mother_this.setState({action_state:'to_link_text'})
        }
    }

    renderQueryTextLinker_target(idx){
        var color 
        if(this.props.mother_state.cur_query_index=='target_'+idx.toString()){
            color ='#ff8888'
        }else if(this.props.mother_state.selected_target_indexes[idx]==undefined){
            color ='#eeeeee'
        } else{
            color ='#00ff88'
        }
        return (<span className='linker' style={{backgroundColor: color}} onClick={this.selectLinker.bind(this, 'target_'+idx.toString())}>{this.props.mother_state.selected_target_columns[idx].split('|')[0]}</span>)
    }

    renderQueryTextLinker_conditions(key){
        return this.props.mother_state.selected_condition_columns.map((val, idx)=>{
            var col = val.split('|')[0]
            var value_key = val.split('|')[1]
            var counter = 0
            var idx2 
            for(var j in this.props.mother_state.selected_condition_columns){
                
                var curkey = this.props.mother_state.selected_condition_columns[j].split('|')[1]
                if(value_key == curkey){
                    counter = counter +1
                }
                if(j==idx){
                    idx2=counter
                }
            }

            if (key!=undefined){
                if(key!=value_key){
                    return
                }
            }
            var value
            for(var i in this.props.mother_state.rowData){
                if(this.props.mother_state.rowData[i]._id == value_key){
                    value = this.props.mother_state.rowData[i][col]
                    break
                }
            }
            var color 
            if(this.props.mother_state.cur_query_index=='condition_'+idx.toString()){
                color ='#ff8888'
            }else if(this.props.mother_state.selected_condition_indexes[idx]==undefined){
                color ='#eeeeee'
            } else{
                color ='#ffffaa'
            }
            var comma = ''
            if (counter!=idx2){
                comma = ', '
            }
            return (<span><span className='linker' style={{backgroundColor: color}} onClick={this.selectLinker.bind(this, 'condition_'+idx.toString())}>{col}={value}</span>{comma}</span>)
        })
    }

    renderQueryTextLinker_conditions2(){
        return this.props.mother_state.selected_condition_columns.map((val, idx)=>{
            var col = val.split('|')[0]
            var value_key = val.split('|')[1]
            var counter = 0
            var idx2 
            for(var j in this.props.mother_state.selected_condition_columns){
                
                var curkey = this.props.mother_state.selected_condition_columns[j].split('|')[1]
                if(value_key == curkey){
                    counter = counter +1
                }
                if(j==idx){
                    idx2=counter
                }
            }
            
            var value
            for(var i in this.props.mother_state.rowData){
                if(this.props.mother_state.rowData[i]._id == value_key){
                    value = this.props.mother_state.rowData[i][col]
                    break
                }
            }
            var color 
            if(this.props.mother_state.cur_query_index=='condition_'+idx.toString()){
                color ='#ff8888'
            }else if(this.props.mother_state.selected_condition_indexes[idx]==undefined){
                color ='#eeeeee'
            } else{
                color ='#ffffaa'
            }
            var comma = ''
            if (counter!=idx2){
                comma = ', '
            }
            return (<span><span className='linker' style={{backgroundColor: color}} onClick={this.selectLinker.bind(this, 'condition_'+idx.toString())}>{col}</span>{comma}</span>)
        })
    }

    renderQueryTextLinker_comparators(){
        var color 
        if(this.props.mother_state.cur_query_index=='comparator'){
            color ='#ff8888'
        }else if(this.props.mother_state.selected_query_index==undefined){
            color ='#eeeeee'
        }else{
            color ='#fcad8b'
        }
        return (<span>
            <span className='linker' style={{backgroundColor: color}} onClick={this.selectLinker.bind(this, 'comparator')}>{this.props.mother_state.selected_query_type.split('|')[1]}</span>
        </span>)
    }

    renderQueryTextLinker_nonrank(){
        return (<div>
            <span style={{color: '#888888'}}>Selected query: </span>SELECT {this.renderQueryTextLinker_target(0)} {this.props.mother_state.selected_condition_columns.length!=0 && 
            <span>WHERE {this.renderQueryTextLinker_conditions()}</span>}
        </div>)
    }

    renderQueryTextLinker_rank(){
        return (<div>
            <span style={{color: '#888888'}}>Selected query: </span>SELECT t.Rank FROM (SELECT {this.renderQueryTextLinker_conditions2()}  RANK() OVER (ORDER BY {this.renderQueryTextLinker_target(0)} DESC) Rank) as t WHERE {this.renderQueryTextLinker_conditions()}
        </div>)
    }

    renderQueryTextLinker_comp(){
        var cond1_count = 0
        var cond2_count = 0
        var row1 = this.props.mother_state.selected_target_columns[0].split('|')[1]
        var row2 = this.props.mother_state.selected_target_columns[1].split('|')[1]

        for(var i in this.props.mother_state.selected_condition_columns){
            var cur_cond_row = this.props.mother_state.selected_condition_columns[i].split('|')[1]
            if(cur_cond_row == row1){
                cond1_count = cond1_count + 1
            }
            if(cur_cond_row == row2){
                cond2_count = cond2_count + 1
            }

        }
        return (<div>
            <span style={{color: '#888888'}}>Selected query: </span>
            (SELECT {this.renderQueryTextLinker_target(0)} {cond1_count!=0 && <span>WHERE {this.renderQueryTextLinker_conditions(row1)}</span>})
            {this.renderQueryTextLinker_comparators()}
            (SELECT {this.renderQueryTextLinker_target(1)} {cond2_count!=0 && <span>WHERE {this.renderQueryTextLinker_conditions(row2)}</span>})
        </div>)
    }

    renderQueryTextLinker(){
        if(this.props.mother_state.selected_query_type=='nonrank'){
            return this.renderQueryTextLinker_nonrank()
        }else if(this.props.mother_state.selected_query_type=='rank'){
            return this.renderQueryTextLinker_rank()
        }else if(this.props.mother_state.selected_query_type.indexOf('comp')!=-1){
            return this.renderQueryTextLinker_comp()
        }
    }

    renderChosenTextHighlights_target(){
        return this.props.mother_state.selected_target_indexes.map((val, idx)=>{
            if(val!=undefined){
                console.log(val)
                var chosen_text = this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text
                var color = '#00ff88'
                if(this.props.mother_state.cur_query_index=='target_'+idx.toString()){
                    color = '#ff8888'
                }
                return (<div style={{color:'transparent', position:'absolute', top:0, left:0}}>
                    <span>Selected part: </span>
                    {chosen_text.substr(0, val.start)}
                    <span style={{backgroundColor:color}}>{chosen_text.substr(val.start, val.end-val.start)}</span>
                </div>)
            }
        })
    }

    renderChosenTextHighlights_condition(){
        return this.props.mother_state.selected_condition_indexes.map((val, idx)=>{
            if(val!=undefined){
                console.log(val)
                var chosen_text = this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text
                var color = '#ffff88'
                if(this.props.mother_state.cur_query_index=='condition_'+idx.toString()){
                    color = '#ff8888'
                }
                return (<div style={{color:'transparent', position:'absolute', top:0, left:0}}>
                    <span>Selected part: </span>
                    {chosen_text.substr(0, val.start)}
                    <span style={{backgroundColor:color}}>{chosen_text.substr(val.start, val.end-val.start)}</span>
                </div>)
            }
        })

    }

    renderChosenTextHighlights_comparator(){
        if(this.props.mother_state.selected_query_index!=undefined){
            var val = this.props.mother_state.selected_query_index
            console.log(val)
            var chosen_text = this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text
            var color = '#fcad8b'
            if(this.props.mother_state.cur_query_index=='comparator'){
                color = '#ff8888'
            }
            return (<div style={{color:'transparent', position:'absolute', top:0, left:0}}>
                <span>Selected part: </span>
                {chosen_text.substr(0, val.start)}
                <span style={{backgroundColor:color}}>{chosen_text.substr(val.start, val.end-val.start)}</span>
            </div>)
            
        }

    }

    renderChosenTextHighlights(){
        return (<div style={{position:'absolute', top:'0', zIndex:'-1', left: '0', width:'100%'}}>
            {this.renderChosenTextHighlights_target()}
            {this.renderChosenTextHighlights_condition()}
            {this.renderChosenTextHighlights_comparator()}
        </div>)
    }

    finalize_query(){
        this.props.mother_state.list[this.props.mother_state.selected_list]['query'] = this.props.mother_state.query
        this.props.mother_state.list[this.props.mother_state.selected_list]['selected_target_indexes'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_target_indexes))
        this.props.mother_state.list[this.props.mother_state.selected_list]['selected_condition_indexes'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_condition_indexes))
        this.props.mother_state.list[this.props.mother_state.selected_list]['selected_target_columns'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_target_columns))
        this.props.mother_state.list[this.props.mother_state.selected_list]['selected_condition_columns'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_condition_columns))
        this.props.mother_state.list[this.props.mother_state.selected_list]['selected_query_type'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_query_type))
        if(this.props.mother_state.selected_query_index!=undefined){
            this.props.mother_state.list[this.props.mother_state.selected_list]['selected_query_index'] = JSON.parse(JSON.stringify(this.props.mother_state.selected_query_index))
        }
        
        var _this = this
        this.props.mother_this.setState({
            selected_list:false, 
            action_state: 'idle',
            table_selection:'target',
            selected_target_columns: [],
            selected_condition_columns: [],
            selected_query_type: '', 
            query: '',
            selected_target_indexes: [],
            selected_condition_indexes: [],
            selected_query_index: undefined,
            cur_query_index: undefined, 
            candidate_statements: 'none', 
            candidate_option_single_target: 'nonrank', 
            candidate_option_double_target: 'nonratio', 
        }, function(){
            _this.props.mother_this.refreshTable()
        })
    }

    renderLinkDoneButton(){
        var passed = true
        for(var i in this.props.mother_state.selected_target_indexes){
            if(this.props.mother_state.selected_target_indexes[i]==undefined){
                passed = false
            }
        }
        for(var i in this.props.mother_state.selected_condition_indexes){
            if(this.props.mother_state.selected_condition_indexes[i]==undefined){
                passed = false
            }
        }
        if(this.props.mother_state.selected_query_type!='rank' && this.props.mother_state.selected_query_type!='nonrank' && this.props.mother_state.selected_query_index==undefined){
            passed= false
        }
        if(passed){
            return (<div style={{display:'flex'}}>
                <div className='btn' onClick={this.finalize_query.bind(this)}>Done with Adding Query</div>
                <div className='btn' onClick={this.goBackToCandidateSelection.bind(this)}>Go Back to Candidate Selection</div>
            </div>)
        }else{
            return (<div style={{display:'flex'}}>
                <div className='btn' disabled>Done with Adding Query</div>
                <div className='btn' onClick={this.goBackToCandidateSelection.bind(this)}>Go Back to Candidate Selection</div>
            </div>)
        }
    }

    

    render(){
        

        return (<div style={{height: '100%', padding:'20px', overflowY:'scroll'}}>
            <div style={{padding:'10px'}}>
                <div style={{display:'flex'}}>
                    <div>List of statements.</div>
                    {this.props.mother_state.action_state=='idle' && <div className='btn' style={{lineHeight:'22px', height:'22px', marginLeft:'10px'}} onClick={this.editSelectedStatement.bind(this)}>Edit selected statement</div>}
                    
                </div>
                <select id='statement_list' name='list' multiple size='4' style={{display:'block'}} disabled={this.props.mother_state.action_state!='idle'}>
                    {this.renderList()}
                </select>
            </div>
            <div style={{padding:'10px'}}>
                {this.props.mother_state.action_state=='idle' && this.props.mother_state.selected_list==false && <div>
                    <div className='btn' onClick={this.startSelecting.bind(this)}>Click to add a new statement.</div>
                </div>}

                {this.props.mother_state.action_state=='to_select_text' && <div>
                    <div>Please choose the part of the article to refer to.</div>
                    <div className='btn' onClick={this.cancelSelecting.bind(this)}>Cancel</div>
                </div>}

                {this.props.mother_state.action_state=='selecting_text' && <div>
                    <div>Please end choosing the part of the article to refer to.</div>
                </div>}

                {this.props.mother_state.action_state=='not_yet_candidate' && this.props.mother_state.selected_list!=false && <div>
                    <div><span style={{color:'#888888'}}>Selected part:</span> <span style={{backgroundColor:'rgba(68, 170, 255, 0.3)'}}>{this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text}</span></div>
                    {this.props.mother_state.action_state=='not_yet_candidate' && <div>
                        <div style={{display:'inline-flex'}}>
                            <div>Select the part of the table that corresponds to the selected part of the article.</div>
                            <div>
                                <span className='btn' style={{verticalAlign:'top', lineHeight:'20px', height:'20px', backgroundColor:(this.props.mother_state.table_selection!='target')?'#eeeeee':''}} onClick={this.chooseTableSelectionMethod.bind(this, 'target')}>Select target</span>
                                <span className='btn' style={{verticalAlign:'top', lineHeight:'20px', height:'20px', backgroundColor:(this.props.mother_state.table_selection!='condition')?'#eeeeee':''}} onClick={this.chooseTableSelectionMethod.bind(this, 'condition')}>Select condition</span>
                            </div>
                        </div>
                        <div style={{paddingTop:'10px', paddingLeft:'10px', paddingRight:'10px',display: 'flex', position:'relative'}}>
                            <div sttle={{lineHeight:'22px', marginRight:'20px'}}>List of candidates.</div> 
                            {this.props.mother_state.selected_target_columns.length==1 && 
                            <div>
                                <label style={{marginRight:'20px'}}>
                                    <input name="single_target_selection" type="radio" onChange={this.single_target_change_canditype.bind(this)} checked={this.props.mother_state.candidate_option_single_target=='nonrank'}/>
                                    <span>Non-Rank</span>
                                </label>  
                                <label>
                                    <input name="single_target_selection" type="radio" onChange={this.single_target_change_canditype.bind(this)} checked={this.props.mother_state.candidate_option_single_target=='rank'}/>
                                    <span>Rank</span>
                                </label>    
                            </div>}
                            {this.props.mother_state.selected_target_columns.length==2 && 
                            <div>
                                <label style={{marginRight:'20px'}}>
                                    <input name="double_target_selection" type="radio" onChange={this.double_target_change_canditype.bind(this)} checked={this.props.mother_state.candidate_option_double_target=='nonratio'}/>
                                    <span>Non-Ratio</span>
                                </label>  
                                <label>
                                    <input name="double_target_selection" type="radio" onChange={this.double_target_change_canditype.bind(this)} checked={this.props.mother_state.candidate_option_double_target=='ratio'}/>
                                    <span>Ratio</span>
                                </label>    
                            </div>}
                            <div className='btn' style={{height:'25px', lineHeight:'25px', position:'absolute', right:'10px'}} disabled={this.props.mother_state.candidate_selected==-1} onClick={this.candidate_confirm.bind(this)}>Select the query</div>
                        
                        </div>
                        {typeof(this.props.mother_state.candidate_statements)!='string' && <div style={{paddingLeft:'10px',paddingRight:'10px'}}>
                            
                            <div style={{display:'block', padding:'5px', margin:'2px', borderTop: 'solid 1px #333333'}}>
                                {this.renderCandidates()}
                            </div>
                        </div>}
                        <div className='btn' onClick={this.cancelSelecting.bind(this)}>Cancel</div>
                    </div>}
                </div>}
                {(this.props.mother_state.action_state=='candidate_selected' || this.props.mother_state.action_state=='to_link_text' || this.props.mother_state.action_state=='linking_text') && <div style={{position:'relative'}}>
                    <div onMouseDown={this.linkingDown.bind(this)} onMouseUp={this.linkingUp.bind(this)} onMouseOut={this.linkingOut.bind(this)}>
                        <span style={{color:'#888888'}}>Selected part:</span> <span>{this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text}</span>
                    </div>
                    {this.renderChosenTextHighlights()}
                    <div style={{position:'absolute', top: '0', zIndex:-2}}><span style={{color: 'transparent'}}>Selected part:</span> <span style={{color: 'transparent', backgroundColor:'rgba(68, 170, 255, 0.3)'}}>{this.props.mother_state.list[this.props.mother_state.selected_list].chosen_text}</span></div>
                    {this.renderQueryTextLinker()}
                    <br/>
                    {this.renderLinkDoneButton()}
                </div>}
            </div>
            
        </div>)
    }
}

export default Annotation;