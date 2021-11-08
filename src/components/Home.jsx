import React, {Component} from 'react';
import DataTable from './DataTable';
import Article from './Article'
import Annotation from './Annotation'


class Home extends Component{
  constructor(props) {
		super(props);

		this.state = {
      action_state: 'idle', // idle, to_select_text, selecting_text, not_yet_candidate, candidates, candidate_selected 
      selected_list: false, 
      list: {}, 

      
      table_selection:'target',
      selected_target_columns: [],
      selected_condition_columns: [],
      selected_query_type: '', 
      query: '',

      selected_target_indexes: [],
      selected_condition_indexes: [],
      selected_query_index: undefined,
      cur_query_index: undefined, 

      // for candidate selection
      candidate_statements: 'none', 

      candidate_option_single_target: 'nonrank', 
      candidate_option_double_target: 'nonratio', 

      candidate_hovered: -1,
      candidate_selected: -1,




			columnDefs: [
				{headerName: "Country", field: "country", sortable:true, filter: 'agTextColumnFilter', cellStyle: params => {
              if (this.state.selected_target_columns.indexOf('country|'+params.data._id)!=-1) {
                  return {backgroundColor: '#00ff88'};
              }else if (this.state.selected_condition_columns.indexOf('country|'+params.data._id)!=-1) {
                return {backgroundColor: '#ffff00'};
              }else if (typeof(this.state.candidate_statements)!='string' && this.state.candidate_selected!=-1){
                if(this.state.candidate_statements[this.state.candidate_selected][1].indexOf('country|'+params.data._id)!=-1){
                  return {backgroundColor:'#ffffaa'}
                }
                return null
              }
              return null;
          }
        },
				{headerName: "Sleep Hour", field: "sleep_hour", sortable:true, filter: 'agNumberColumnFilter', cellStyle: params => {
              if (this.state.selected_target_columns.indexOf('sleep_hour|'+params.data._id)!=-1) {
                  return {backgroundColor: '#00ff88'};
              }else if (this.state.selected_condition_columns.indexOf('sleep_hour|'+params.data._id)!=-1) {
                return {backgroundColor: '#ffff00'};
              }else if (typeof(this.state.candidate_statements)!='string' && this.state.candidate_selected!=-1){
                if(this.state.candidate_statements[this.state.candidate_selected][1].indexOf('sleep_hour|'+params.data._id)!=-1){
                  return {backgroundColor:'#ffffaa'}
                }
                return null
              }
              return null;
          }
        },
				{headerName: "Eating, Drinking Hour", field: "eating_drinking_hour", sortable:true, filter: 'agNumberColumnFilter', cellStyle: params => {
              if (this.state.selected_target_columns.indexOf('eating_drinking_hour|'+params.data._id)!=-1) {
                  return {backgroundColor: '#00ff88'};
              }else if (this.state.selected_condition_columns.indexOf('eating_drinking_hour|'+params.data._id)!=-1) {
                return {backgroundColor: '#ffff00'};
              }else if (typeof(this.state.candidate_statements)!='string' && this.state.candidate_selected!=-1){
                if(this.state.candidate_statements[this.state.candidate_selected][1].indexOf('eating_drinking_hour|'+params.data._id)!=-1){
                  return {backgroundColor:'#ffffaa'}
                }
                return null
              }
              return null;
          }
        },
        {headerName: "GDP Unpaid", field: "gdp_unpaid", sortable:true, filter: 'agNumberColumnFilter', cellStyle: params => {
              if (this.state.selected_target_columns.indexOf('gdp_unpaid|'+params.data._id)!=-1) {
                  return {backgroundColor: '#00ff88'};
              }else if (this.state.selected_condition_columns.indexOf('gdp_unpaid|'+params.data._id)!=-1) {
                return {backgroundColor: '#ffff00'};
              }else if (typeof(this.state.candidate_statements)!='string' && this.state.candidate_selected!=-1){
                if(this.state.candidate_statements[this.state.candidate_selected][1].indexOf('gdp_unpaid|'+params.data._id)!=-1){
                  return {backgroundColor:'#ffffaa'}
                }
                return null
              }
              return null;
          }
        },
        {headerName: "OECD", field:'oecd', sortable:true, filter: true, cellStyle: params => {
              if (this.state.selected_target_columns.indexOf('oecd|'+params.data._id)!=-1) {
                  return {backgroundColor: '#00ff88'};
              }else if (this.state.selected_condition_columns.indexOf('oecd|'+params.data._id)!=-1) {
                return {backgroundColor: '#ffff00'};
              }else if (typeof(this.state.candidate_statements)!='string' && this.state.candidate_selected!=-1){
                if(this.state.candidate_statements[this.state.candidate_selected][1].indexOf('oecd|'+params.data._id)!=-1){
                  return {backgroundColor:'#ffffaa'}
                }
                return null
              }
              return null;
          }
        }

			],
			rowData: [
				{_id:'f', country: 'French', sleep_hour: 9, eating_drinking_hour: 5, gdp_unpaid:8, oecd: true},
        {_id:'u', country: 'US', sleep_hour: 8, eating_drinking_hour: 3.5, gdp_unpaid:8, oecd: true},
        {_id:'j', country: 'Japan', sleep_hour: 7, eating_drinking_hour: 3, gdp_unpaid:2, oecd: true} 
			], 
      article: "MARGARET THATCHER, a former British prime minister, reportedly got by on just four hours' sleep a night. Such deprivation would trouble many people, and certainly the French, who sleep for nearly nine hours on average, according to a report by the OECD. True to stereotype, the French also spend the most time eating and drinking of OECD members—indeed, they eat for almost twice as long as the Americans. The Japanese appear to have a tough time of it, working by far the longest hours. However, they also devote less time to unpaid work such as household chores and childcare, activities that account for around one third of the OECD's GDP.",

		}
	}

  combination(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    if(min==0){
      all.push([])
    }
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    
    return all;
  }

  refreshTable(){
    var nrd = JSON.parse(JSON.stringify(this.state.rowData))
    var nrow = JSON.parse(JSON.stringify(nrd[nrd.length-1]))
    nrow['_id']='n'
    nrd.push(nrow)
    var _this = this

    this.setState({rowData: nrd}, function(){
      _this.state.rowData.splice(_this.state.rowData.length-1, 1)
      var nrd = JSON.parse(JSON.stringify(_this.state.rowData))
        _this.setState({rowData:nrd}, function(){
      })
    })
  }

  search_and_add_to_query(sql_query, condition_row, condition_column){
    var a_rowData
    for(var j in this.state.rowData){
      if(this.state.rowData[j]['_id']==condition_row){
        a_rowData = this.state.rowData[j]
      }
    }
    var appended
    if(typeof(a_rowData[condition_column])=='string'){
      appended = a_rowData[condition_column]
      return sql_query + ' '+condition_column+"='"+appended+"'"
    }else{
      appended = a_rowData[condition_column].toString()
      return sql_query + ' '+condition_column+'='+appended
    }
    
  }

  generate_candidate_statements_one_target_nonrank(){
    var target_column = this.state.selected_target_columns[0].split('|')[0]
    var target_row = this.state.selected_target_columns[0].split('|')[1]
    var sql_query = 'SELECT '+ target_column
    var queries = []
    var condition_count = 0
    var queried_columns = []
    for(var i in this.state.selected_condition_columns){
      if(condition_count==0){
        sql_query = sql_query+' WHERE'
      }else{
        sql_query = sql_query+' AND'
      }
      var condition_column = this.state.selected_condition_columns[i].split('|')[0]
      var condition_row = this.state.selected_condition_columns[i].split('|')[1]
      queried_columns.push(this.state.selected_condition_columns[i])
      sql_query = this.search_and_add_to_query(sql_query, condition_row, condition_column)
      condition_count = condition_count +1
    }
    console.log(sql_query)
    
    var comb_columns = []
    for(var i in this.state.columnDefs){
      var col_name = this.state.columnDefs[i].field
      if(queried_columns.indexOf(col_name+'|'+target_row)==-1 && col_name != target_column){
        comb_columns.push(col_name)
      }
    }

    var combinations= this.combination(comb_columns, 0)
    console.log(combinations)
    for(var i in combinations){
      var comb = combinations[i]
      var new_query = sql_query
      var new_queried_columns = JSON.parse(JSON.stringify(queried_columns))
      var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
      for(var j in comb){
        if(condition_count==0){
          new_query = new_query+' WHERE'
        }else{
          new_query = new_query+' AND'
        }

        var condition_column = comb[j]
        var condition_row = target_row
        new_queried_columns.push(comb[j]+'|'+target_row)
        new_query = this.search_and_add_to_query(new_query, condition_row, condition_column)
        condition_count = condition_count +1
      }
      queries.push([new_query, new_queried_columns, target, 'nonrank'])

    }

    console.log(queries)
    this.setState({candidate_statements:queries})


  }

  generate_candidate_statements_one_target_rank(){
    var target_column = this.state.selected_target_columns[0].split('|')[0]
    var target_row = this.state.selected_target_columns[0].split('|')[1]
    
    var sql_query_head = 'SELECT t.Rank FROM (SELECT'
    var sql_query_mid1= ' RANK() OVER (ORDER BY '+target_column+' DESC) Rank) as t WHERE'
    var queries = []
    var condition_count = 0
    var queried_columns = []

    var sql_query_conditions1 = ''
    var sql_query_conditions2 = ''

    if(this.state.selected_condition_columns.length==0){
      this.setState({candidate_statements: 'more_conditions'})
      return 
    }

    for(var i in this.state.selected_condition_columns){
      if(condition_count!=0){
        sql_query_conditions1 = sql_query_conditions1+','
        sql_query_conditions2 = sql_query_conditions2+' AND'
      }

      var condition_column = this.state.selected_condition_columns[i].split('|')[0]
      var condition_row = this.state.selected_condition_columns[i].split('|')[1]
      queried_columns.push(this.state.selected_condition_columns[i])
      sql_query_conditions1 = sql_query_conditions1+ ' '+ condition_column
      sql_query_conditions2 = this.search_and_add_to_query(sql_query_conditions2, condition_row, condition_column)
      condition_count = condition_count +1
    }
    
    var comb_columns = []
    for(var i in this.state.columnDefs){
      var col_name = this.state.columnDefs[i].field
      if(queried_columns.indexOf(col_name+'|'+target_row)==-1 && col_name != target_column){
        comb_columns.push(col_name)
      }
    }

    var combinations= this.combination(comb_columns, 0)
    console.log(combinations)
    for(var i in combinations){
      var comb = combinations[i]
      var new_query1 = sql_query_conditions1
      var new_query2 = sql_query_conditions2
      var new_queried_columns = JSON.parse(JSON.stringify(queried_columns))
      var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
      for(var j in comb){
        if(condition_count!=0){
          new_query1 = new_query1+','
          new_query2 = new_query2+' AND'
        }

        var condition_column = comb[j]
        var condition_row = target_row
        new_queried_columns.push(condition_column+'|'+target_row)
        new_query1 = new_query1 + ' '+ condition_column
        new_query2 = this.search_and_add_to_query(new_query2, condition_row, condition_column)
        condition_count = condition_count +1
      }
      queries.push([sql_query_head+new_query1+sql_query_mid1+new_query2, new_queried_columns, target, 'rank'])

    }

    console.log(queries)
    this.setState({candidate_statements:queries})


  }

  generate_candidate_statements_two_targets_same_row(){
    var target_column1 = this.state.selected_target_columns[0].split('|')[0]
    var target_column2 = this.state.selected_target_columns[1].split('|')[0]
    var target_row = this.state.selected_target_columns[0].split('|')[1]
    var comp

    for(var i in this.state.rowData){
      if(this.state.rowData[i]._id==target_row){
        var val1 = this.state.rowData[i][target_column1]
        var val2 = this.state.rowData[i][target_column2]

        if(['float','int', 'number'].indexOf(typeof(val1))==-1){
          this.setState({candidate_option_double_target:'nonratio'})
          if(val1==val2){
            comp='=='
          }else{
            comp='!='
          }
        }else{
          if(this.state.candidate_option_double_target=='nonratio'){
            if(val1==val2){
              comp='=='
            }else if(val1>val2){
              comp='>'
            }else if(val1<val2){
              comp='<'
            }
          }else{
            comp='/'
          }
        }
      }
    }

    var sql_query1 = 'SELECT '+ target_column1
    var sql_query2 = 'SELECT '+ target_column2
    var queries = []
    var condition_count = 0
    var queried_columns = []

    for(var i in this.state.selected_condition_columns){
      if(condition_count==0){
        sql_query1 = sql_query1+' WHERE'
        sql_query2 = sql_query2+' WHERE'
      }else{
        sql_query1 = sql_query1+' AND'
        sql_query2 = sql_query2+' AND'
      }
      var condition_column = this.state.selected_condition_columns[i].split('|')[0]
      var condition_row = this.state.selected_condition_columns[i].split('|')[1]
      queried_columns.push(condition_column+'|'+target_row)
      sql_query1 = this.search_and_add_to_query(sql_query1, condition_row, condition_column)
      sql_query2 = this.search_and_add_to_query(sql_query2, condition_row, condition_column)
      condition_count = condition_count +1
    }

    var comb_columns = []
    for(var i in this.state.columnDefs){
      var col_name = this.state.columnDefs[i].field
      if(queried_columns.indexOf(col_name+'|'+target_row)==-1 && col_name != target_column1 && col_name != target_column2){
        comb_columns.push(col_name)
      }
    }

    var combinations= this.combination(comb_columns, 0)
    console.log(combinations)
    for(var i in combinations){
      var comb = combinations[i]
      var new_query1 = sql_query1
      var new_query2 = sql_query2
      var new_queried_columns = JSON.parse(JSON.stringify(queried_columns))
      for(var j in comb){
        if(condition_count==0){
          new_query1 = new_query1+' WHERE'
          new_query2 = new_query2+' WHERE'
        }else{
          new_query1 = new_query1+' AND'
          new_query2 = new_query2+' AND'
        }

        var condition_column = comb[j]
        var condition_row = this.state.selected_target_columns[0].split('|')[1]
        new_queried_columns.push(condition_column+'|'+target_row)
        new_query1 = this.search_and_add_to_query(new_query1, condition_row, condition_column)
        new_query2 = this.search_and_add_to_query(new_query2, condition_row, condition_column)
        condition_count = condition_count +1
      }
      if(this.state.candidate_option_double_target=='nonratio'){
        var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
      }else{
        var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
        var new_query = '('+new_query2+')'+comp+'('+new_query1+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns)).reverse()
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
      }

      

    }
    this.setState({candidate_statements:queries})
      

  }

  generate_candidate_statements_two_targets_diff_rows(){
    var target_column1 = this.state.selected_target_columns[0].split('|')[0]
    var target_column2 = this.state.selected_target_columns[1].split('|')[0]
    var target_row1 = this.state.selected_target_columns[0].split('|')[1]
    var target_row2 = this.state.selected_target_columns[1].split('|')[1]
    var comp
    var val1, val2
    for(var i in this.state.rowData){
      if(this.state.rowData[i]._id==target_row1){
        val1 = this.state.rowData[i][target_column1]
      }
      if(this.state.rowData[i]._id==target_row2){
        val2 = this.state.rowData[i][target_column2]
      }
    }


    if(['float','int', 'number'].indexOf(typeof(val1))==-1){
      this.setState({candidate_option_double_target:'nonratio'})
      if(val1==val2){
        comp='=='
      }else{
        comp='!='
      }
    }else{
      if(this.state.candidate_option_double_target=='nonratio'){
        if(val1==val2){
          comp='=='
        }else if(val1>val2){
          comp='>'
        }else if(val1<val2){
          comp='<'
        }
      }else{
        comp='/'
      }
    }
    
    var queries = []


    // those that apply the same colums
    var do_same_col = true
    for(var i in this.state.selected_condition_columns){
      var condition_column = this.state.selected_condition_columns[i].split('|')[0]

      if(condition_column==target_column1 && condition_column!=target_column2){
        do_same_col = false
      }

      if(condition_column==target_column2 && condition_column!=target_column1){
        do_same_col = false
      }
    }

    if(do_same_col){
      var sql_query1 = 'SELECT '+ target_column1
      var sql_query2 = 'SELECT '+ target_column2
      var condition_count = 0
      var queried_columns = []

      for(var i in this.state.selected_condition_columns){
        var condition_column = this.state.selected_condition_columns[i].split('|')[0]
        if(queried_columns.indexOf(this.state.selected_condition_columns[i])==-1){
          if(condition_count==0){
            sql_query1 = sql_query1+' WHERE'
            sql_query2 = sql_query2+' WHERE'
          }else{
            sql_query1 = sql_query1+' AND'
            sql_query2 = sql_query2+' AND'
          }
          
          queried_columns.push(condition_column+'|'+target_row1)
          queried_columns.push(condition_column+'|'+target_row2)
          sql_query1 = this.search_and_add_to_query(sql_query1, target_row1, condition_column)
          sql_query2 = this.search_and_add_to_query(sql_query2, target_row2, condition_column)
          condition_count = condition_count +1
        }else{
          continue
        }
        
      }

      var comb_columns = []
      for(var i in this.state.columnDefs){
        var col_name = this.state.columnDefs[i].field
        if((queried_columns.indexOf(col_name+'|'+target_row1)==-1 && queried_columns.indexOf(col_name+'|'+target_row2)==-1) && col_name != target_column1 && col_name != target_column2){
          comb_columns.push(col_name)
        }
      }

      var combinations= this.combination(comb_columns, 0)
      console.log(combinations)
      for(var i in combinations){
        var comb = combinations[i]
        var new_query1 = sql_query1
        var new_query2 = sql_query2
        var new_queried_columns = JSON.parse(JSON.stringify(queried_columns))
        for(var j in comb){
          var condition_column = comb[j]
          
          if(new_queried_columns.indexOf(condition_column)==-1){
            if(condition_count==0){
              new_query1 = new_query1+' WHERE'
              new_query2 = new_query2+' WHERE'
            }else{
              new_query1 = new_query1+' AND'
              new_query2 = new_query2+' AND'
            }

            new_queried_columns.push(condition_column+'|'+target_row1)
            new_queried_columns.push(condition_column+'|'+target_row2)
            new_query1 = this.search_and_add_to_query(new_query1, target_row1, condition_column)
            new_query2 = this.search_and_add_to_query(new_query2, target_row2, condition_column)
            condition_count = condition_count +1
          }else{
            continue
          }
          
        }

        new_queried_columns.sort()

        if(this.state.candidate_option_double_target=='nonratio'){
          var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
          var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
          queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
        }else{
          var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
          var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
          queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
          var new_query = '('+new_query2+')'+comp+'('+new_query1+')'
          var target = JSON.parse(JSON.stringify(this.state.selected_target_columns)).reverse()
          queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
        }
      }
    }

    // different columns...
    var sql_query1 = 'SELECT '+ target_column1
    var sql_query2 = 'SELECT '+ target_column2
    var condition_count1 = 0
    var condition_count2 = 0
    var queried_columns = []

    for(var i in this.state.selected_condition_columns){
      var condition_column = this.state.selected_condition_columns[i].split('|')[0]
      var condition_row = this.state.selected_condition_columns[i].split('|')[1]
      if(queried_columns.indexOf(this.state.selected_condition_columns[i])==-1){
        if(condition_row == target_row1){
          if(condition_count1==0){
            sql_query1 = sql_query1+' WHERE'
          }else{
            sql_query1 = sql_query1+' AND'
          }
          sql_query1 = this.search_and_add_to_query(sql_query1, condition_row, condition_column)
          condition_count1 = condition_count1 +1
        }else if(condition_row == target_row2){
          if(condition_count2==0){
            sql_query2 = sql_query2+' WHERE'
          }else{
            sql_query2 = sql_query2+' AND'
          }
          sql_query2 = this.search_and_add_to_query(sql_query2, condition_row, condition_column)
          condition_count2 = condition_count2 +1
        }
        queried_columns.push(this.state.selected_condition_columns[i])        
      }else{
        continue
      } 
    }

    var comb_columns = []
    for(var i in this.state.columnDefs){
      var col_name = this.state.columnDefs[i].field
      if(queried_columns.indexOf(col_name+'|'+target_row1)==-1 && col_name != target_column1){
        comb_columns.push(col_name+'|'+target_row1)
      }
      if(queried_columns.indexOf(col_name+'|'+target_row2)==-1 && col_name != target_column2){
        comb_columns.push(col_name+'|'+target_row2)
      }
    }
    
    var combinations= this.combination(comb_columns, 0)
    console.log(combinations)
    for(var i in combinations){
      var comb = combinations[i]
      var new_query1 = sql_query1
      var new_query2 = sql_query2
      var new_queried_columns = JSON.parse(JSON.stringify(queried_columns))

      var check_new_queried_columns = new_queried_columns.concat(comb);
      check_new_queried_columns.sort()
      for(var j in queries){
        if(queries[j][1].length === check_new_queried_columns.length && queries[j][1].every((value, index) => value === check_new_queried_columns[index])){
          continue
        }    
      }

      for(var j in comb){
        var condition_column = comb[j].split('|')[0]
        var condition_row = comb[j].split('|')[1]
        
        if(new_queried_columns.indexOf(comb[j])==-1){
          if(condition_row==target_row1){
            if(condition_count1==0){
              new_query1 = new_query1+' WHERE'
            }else{
              new_query1 = new_query1+' AND'
            }
            new_query1 = this.search_and_add_to_query(new_query1, condition_row, condition_column)
            condition_count1 = condition_count1 +1
          }else if(condition_row==target_row2){
            if(condition_count2==0){
              new_query2 = new_query2+' WHERE'
            }else{
              new_query2 = new_query2+' AND'
            }
            new_query2 = this.search_and_add_to_query(new_query2, condition_row, condition_column)
            condition_count2 = condition_count2 +1
          }

          // new_queried_columns.push(comb[j])
          
        }else{
          continue
        }
        
      }

      new_queried_columns=check_new_queried_columns

      if(this.state.candidate_option_double_target=='nonratio'){
        var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
      }else{
        var new_query = '('+new_query1+')'+comp+'('+new_query2+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns))
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
        var new_query = '('+new_query2+')'+comp+'('+new_query1+')'
        var target = JSON.parse(JSON.stringify(this.state.selected_target_columns)).reverse()
        queries.push([new_query, new_queried_columns, target, 'comp|'+comp])
      }
    }
  
    

    
    this.setState({candidate_statements:queries})
  }

  

  generate_candidate_statements(){
    if(this.state.selected_target_columns.length==1){
      var target_row = this.state.selected_target_columns[0].split('|')[1]
      for(var i in this.state.selected_condition_columns){
          var condition_row = this.state.selected_condition_columns[i].split('|')[1]
          if(target_row!=condition_row){
            this.setState({candidate_statements:'more_target'})
            return
          }
      }
      if(this.state.candidate_option_single_target=='nonrank'){
        this.generate_candidate_statements_one_target_nonrank()
      }else if(this.state.candidate_option_single_target=='rank'){
        this.generate_candidate_statements_one_target_rank()
      }
      
    }else if(this.state.selected_target_columns.length==2){
      var target_row1 = this.state.selected_target_columns[0].split('|')[1]
      var target_row2 = this.state.selected_target_columns[1].split('|')[1]
      if(target_row1==target_row2){
        this.generate_candidate_statements_two_targets_same_row()
      }else{
        this.generate_candidate_statements_two_targets_diff_rows()
      }
    }else if(this.state.selected_target_columns.length==0){
      this.setState({candidate_statements:'none'})
    }
    this.setState({candidate_selected: -1})

  }

  render(){
    return (
      <div className='home'>
        <div className='row upper' style={{margin: 0}}>
          <div className='col s6 datatable'>
            <DataTable mother_state={this.state} mother_this={this}></DataTable>
          </div>
          <div className='col s6 article'>
            <Article mother_state={this.state} mother_this={this}></Article>
          </div>
        </div>
        
        <div className='col s12 bottom'>
          <Annotation mother_state={this.state} mother_this={this}></Annotation>
        </div>
      </div>)
  }
}

export default Home;