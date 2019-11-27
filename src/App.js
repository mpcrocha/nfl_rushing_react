import React, { Component } from 'react'

class Table extends Component {
  constructor(props) {
      super(props)
      this.state = {
      error: null,
      isLoaded: false,
      playerName: '',
      rushings: [],
      total: null,
      per_page: null,
      current_page: null,
      current_page_url: null,
      sort_params: []
    };
    
   }

   apiCall(url) {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            rushings: result.data,
            total: result.meta["total-pages"],
            per_page: result.meta["per-page"],
            current_page: result.meta["current-page"],
            current_page_url: result.links.self
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    this.apiCall("http://localhost:3001/api/v1/rushing_statistics")
  }

 renderTableHeader() {
    return [<th key='0'>Player</th>, 
    <th key='1'>Team</th>,  
    <th key='2'>Pos</th>, 
    <th key='3'>Att/G</th>, 
    <th key='4'>Att</th>, 
    <th key='5' onClick={(e)=>{this.sortData('yds',e)}}>Yrds</th>, 
    <th key='6'>Avg</th>, 
    <th key='7'>Yds/G</th>,
    <th key='8' onClick={(e)=>{this.sortData('td',e)}}>TD</th>, 
    <th key='9'onClick={(e)=>{this.sortData('lng',e)}}>Lng</th>, 
    <th key='10'>1st</th>, 
    <th key='11'>1st%</th>, 
    <th key='12'>20+</th>, 
    <th key='13'>40+</th>,
    <th key='14'>FUM</th> ]
 }

 renderTableData() {
    return this.state.rushings.map((rushing) => {
       const { player, team, pos, 
               att, 'att-g' : att_g, 
               yds, avg, 
               'yds-g': yds_g, 
               td, lng, first, 
               'first-pct' : first_pct, 
               'twenty-plus' : twenty_plus , 
               'forty-plus': forty_plus, 
               fum } = rushing.attributes
       return (
          <tr key={player}>
             <td>{player}</td>
             <td>{team}</td>
             <td>{pos}</td>
             <td>{att}</td>
             <td>{att_g}</td>
             <td>{yds}</td>
             <td>{avg}</td>
             <td>{yds_g}</td>
             <td>{td}</td>
             <td>{lng}</td>
             <td>{first}</td>
             <td>{first_pct}</td>
             <td>{twenty_plus}</td>
             <td>{forty_plus}</td>
             <td>{fum}</td>
          </tr>
       )
    })
 }

 sortData(key,e) {
  e.preventDefault();
  var old_sort_params = this.state.sort_params.slice(0);
  var current_page_url = this.state.current_page_url;
  
  if(this.state.sort_params.includes(key)) {
    var index = this.state.sort_params.indexOf(key);
    this.state.sort_params.splice(index, 1);
    this.state.sort_params.push('-'+key);
  } else if(this.state.sort_params.includes('-'+key)){
    var index = this.state.sort_params.indexOf('-'+key);
    this.state.sort_params.splice(index, 1);
  } else {
    this.state.sort_params.push(key);
  }

  var url = ''
  if(old_sort_params.length == 0){
    url = this.state.current_page_url + '&sort=' + this.state.sort_params;
  } else if(this.state.sort_params.length == 0) {
    url = "http://localhost:3001/api/v1/rushing_statistics";
  } else {
    const new_sort_query = 'sort='+ this.state.sort_params.join('%2C');
    url = current_page_url.replace('sort='+old_sort_params.join('%2C'), new_sort_query);
  }
  this.apiCall(url);
 }

 renderPageNumbers() {
  const pageNumbers = [];
  for (let i = 1; i <= this.state.total; i++) {
      pageNumbers.push(i);
  }

  return pageNumbers.map(number => {
    let classes = this.state.current_page === number ? 'active' : '';
    if (number == 1 || number == this.state.total || (number >= this.state.current_page - 2 && number <= this.state.current_page + 2)) {
      const url = this.state.current_page_url.replace('page%5Bnumber%5D='+this.state.current_page, 'page%5Bnumber%5D='+number)
      return (
        <span key={number} className={classes} onClick={() => this.apiCall(url)}>{number}</span>
      );
    }
  })
 }

 render() { 
    return (
       <div>
          <h1 id='title'>NFL Rushings</h1>
          <div>
            <label>Player Name</label>
          
            <input type="text" name={"search"} id={"search"}
                 className="form-control"/>
            <button onClick={(e)=>{this.filterPlayer(e)}}>Search Player</button>     
          </div>
          <table id='rushings'>
             <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.renderTableData()}
             </tbody>
          </table>

          <div className='pagination'>
            <span onClick={() => this.apiCall("http://localhost:3001/api/v1/rushing_statistics")}>&laquo;</span>
            {this.renderPageNumbers()}
          </div>

       </div>
    )
 }
 
 filterPlayer() {
  const player = document.getElementById("search").value
  this.apiCall("http://localhost:3001/api/v1/rushing_statistics?player=" + player )
 }
} 

export default Table





