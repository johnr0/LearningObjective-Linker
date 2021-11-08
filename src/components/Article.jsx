import React, {Component} from 'react'

class Article extends Component{

    mousedown(){
        if(this.props.mother_state.action_state=='to_select_text'){
            this.props.mother_this.setState({action_state:'selecting_text'})
        }
    }

    mouseup(){
        if(this.props.mother_state.action_state=='selecting_text'){
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

            if(chosen_text!=''){
                var _id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);

                var new_item = {_id: _id, chosen_text: chosen_text, start:start, end:end}
                this.props.mother_state.list[_id] = new_item
                this.props.mother_this.setState({action_state:'not_yet_candidate', selected_list:_id})
            }
            
        }
    }

    mouseout(){
        if(this.props.mother_state.action_state=='selecting_text'){
            this.props.mother_this.setState({action_state:'to_select_text'})
        }
    }

    renderHighlights(){
        return Object.keys(this.props.mother_state.list).map((val, idx)=>{
            var obj = this.props.mother_state.list[val]
            var article_text_a = this.props.mother_state.article.substr(0, obj.start)
            var article_text_b = this.props.mother_state.article.substr(obj.start, obj.end-obj.start)
            var article_text_c = this.props.mother_state.article.substr(obj.end, this.props.mother_state.article.length-obj.end)
            return (<div key={'highlight_'+val} style={{position:'absolute', left:'20px', right:'20px', top:'20px', color: 'transparent', backgroundColor:'transparent'}}>
                {article_text_a}
                <mark style={{color:'transparent', opacity: '0.3', backgroundColor:'#44aaff'}}>{article_text_b}</mark>
                {article_text_c}
            </div>)
        })
    }

    render(){
        return (<div style={{height: '100%', padding:'20px', position:'relative'}}>
            {this.renderHighlights()}
            <div style={{backgroundColor:'transparent', position:'relative', zIndex:'3'}} 
                 onMouseDown={this.mousedown.bind(this)} 
                 onMouseUp={this.mouseup.bind(this)} 
                 onMouseOut={this.mouseout.bind(this)}>
                 {this.props.mother_state.article}
            </div>
            
            
        </div>)
    }
}

export default Article;