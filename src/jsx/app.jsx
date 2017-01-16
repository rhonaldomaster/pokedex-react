var app = (function () {
  var apiUrl = '//pokeapi.co/api/v2/', offset = 0, pageItems = 100;

  var init = function () {
    renderList();
    events();
  };

  var renderList = function () {
    var Pokemon = React.createClass({
      render: function () {
        return (
          <a href='#' className='pokelist__link js-view-detail' data-poke-index={this.props.index + offset + 1}>
            <span className='item-number'>{pad(this.props.index + offset + 1)}</span>
            <img src={'//raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+(this.props.index + offset + 1)+'.png'} className={'mini-sprite'} alt={this.props.name}/>
            <span className='item-name'>{this.props.name}</span>
          </a>
        );
      }
    });
    var List = React.createClass({
      getInitialState: function() {
        return {list: []};
      },
      componentDidMount: function () {
        this.fetchList();
      },
      render: function () {
        return (
          <div className='pokelist relative'>
            {
              offset > 0 ?
                <button className='button button--primary button--previous js-prev'>&lt;</button>
                :
                ''
            }
            <ul className='list-unstyled'>
              {
                this.state.list.map(function (poke,index) {
                  return (<li class='pokelist__item'>
                    <Pokemon index={index} name={poke.name}></Pokemon>
                  </li>);
                })
              }
            </ul>
            <button className='button button--primary button--next js-next'>&gt;</button>
          </div>
        );
      },
      fetchList: function () {
        var url = apiUrl+'pokemon/?limit='+pageItems+'&offset='+offset;
        var elem = this;
        ajax({method:'get',url:url}, function (data) {
          var info = JSON.parse(data);
          elem.setState({ list: info.results });
        });
      }
    });
    ReactDOM.render(<List />, document.querySelector('.js-main'));
  };

  var prevPage = function () {
    if (offset >= pageItems) {
      offset -= pageItems;
    }
    else {
      offset = 0;
    }
    renderList();
  };

  var nextPage = function () {
    offset += pageItems;
    renderList();
  };

  var pad = function (num, size) {
    var s = num+'';
    while (s.length < size) s = '0' + s;
    return s;
  };

  var viewDetail = function (ev) {
    ev.preventDefault();
    var clickedElement = null;
    if (ev.srcElement)  clickedElement = ev.srcElement;
    else if (ev.target) clickedElement = ev.target;
    if (clickedElement.tagName.toLowerCase() === 'span') {
      clickedElement = clickedElement.parentNode;
    }
    var num = clickedElement.dataset.pokeIndex;
    var url = apiUrl+'pokemon/'+num+'/';
    var Pokemon = React.createClass({
      getInitialState: function() {
        return {data: []};
      },
      componentDidMount: function () {
        this.renderDetail();
      },
      render: function () {
        var poke = this.state.data;
        return (
          <div className='poke-details'>
            <div className='poke-details__card'>
              <img src={'//raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+(poke.id)+'.png'} className='poke-details__image'/>
              <div className='poke-details__types'>
                {
                  poke.types ?
                    poke.types.map(function (elem,i) {
                      return (<div className={'type type--'+elem.type.name}>{elem.type.name}</div>)
                    })
                    :
                    ''
                }
              </div>
            </div>
            <div className='poke-details__data'>
              <div className='poke-details__header'>
                <h3 className='poke-details__title'>{poke.num} {poke.name}</h3>
              </div>
              <div className='poke-details__stats'>
                <div>
                  <h4 className='poke-details__title'>Caracter&iacute;sticas</h4>
                  <table className='stats-table'>
                    <tr>
                      <th>Peso</th>
                      <td>{poke.weight} kg</td>
                      <th>Altura</th>
                      <td>{poke.height} m</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <h4 className='poke-details__title'>Stats base</h4>
                  <table className='stats-table'>
                    <tr>
                      <th>Ataque</th>
                      <td>{poke.atk}</td>
                      <th>Defensa</th>
                      <td>{poke.def}</td>
                    </tr>
                    <tr>
                      <th>Atq especial</th>
                      <td>{poke.spatk}</td>
                      <th>Def especial</th>
                      <td>{poke.spdef}</td>
                    </tr>
                    <tr>
                      <th>Velocidad</th>
                      <td>{poke.spd}</td>
                      <th>Salud</th>
                      <td>{poke.hp}</td>
                    </tr>
                  </table>
                </div>
                <div className='poke-details__abilities'>
                  <h4 className='poke-details__title'>Habilidades</h4>
                  <ul className='list--unstyled'>
                    {
                      poke.abilities ?
                        poke.abilities.map(function (elem,i) {
                          return (<li><a href={elem.ability.url} target='_blank' rel='nofollow'>{elem.ability.name}</a></li>)
                        })
                        :
                        ''
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className='poke-details__moves'>
              <h3 className='poke-details__title'>Movimientos</h3>
              <ul className='poke-moves list--unstyled'>
                {
                  poke.moves ?
                    poke.moves.map(function (elem,i) {
                      return (
                        <li>
                          <h4 className='poke-details__title poke-moves__move-title'>{elem.move.name}</h4>
                          <table className='moves-table'>
                            <thead>
                              <tr>
                                <th>Nivel</th>
                                <th>M&eacute;todo</th>
                                <th>Versi&oacute;n</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                elem.version_group_details ?
                                  elem.version_group_details.map(function (versionDetail,i2) {
                                    return (
                                      <tr>
                                        <td>{versionDetail.level_learned_at}</td>
                                        <td>{versionDetail.move_learn_method.name}</td>
                                        <td>{versionDetail.version_group.name}</td>
                                      </tr>
                                    )
                                  })
                                  :
                                  ''
                              }
                            </tbody>
                          </table>
                        </li>
                      )
                    })
                    :
                    ''
                }
              </ul>
            </div>
            <div className='poke-details__nav'>
              <a href='#' className='js-back'>Regresar a listado</a>
            </div>
          </div>
        );
      },
      renderDetail: function () {
        var elem = this;
        ajax({method:'get',url:url}, function (data) {
          var resp = JSON.parse(data);
          var pokemon = {
            id: num*1, num: pad(num,3), name: resp.name, types: resp.types.reverse(), weight: resp.weight/10,
            height: resp.height/10, abilities:resp.abilities, moves: resp.moves,
            atk:0, def:0, spatk:0, spdef:0, spd:0, hp:0
          };
          var val = null;
          for (var i = 0; i < resp.stats.length; i++) {
            val = resp.stats[i];
            if(val.stat.name=='attack') pokemon.atk = val.base_stat;
            if(val.stat.name=='defense') pokemon.def = val.base_stat;
            if(val.stat.name=='special-attack') pokemon.spatk = val.base_stat;
            if(val.stat.name=='special-defense') pokemon.spdef = val.base_stat;
            if(val.stat.name=='speed') pokemon.spd = val.base_stat;
            if(val.stat.name=='hp') pokemon.hp = val.base_stat;
          }
          elem.setState({ data: pokemon });
        });
      }
    });
    ReactDOM.render(<Pokemon />, document.querySelector('.js-main'));
  };

  var ajax = function (params,callback) {
    var req = null;
    if(window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE) {
        callback(req.responseText);
      }
    };
    req.open(params.method, params.url, true);
    req.send(params.data);
  };

  var events = function () {
    document.addEventListener('click',function (ev) {
      var elem = null;
      if (ev.srcElement)  elem = ev.srcElement;
      else if (ev.target) elem = ev.target;
      if (elem.className.indexOf('js-view-detail') > -1) {
        viewDetail(ev);
      }
      else if (elem.className.indexOf('js-prev') > -1) {
        prevPage(ev);
      }
      else if (elem.className.indexOf('js-next') > -1) {
        nextPage(ev);
      }
      else if (elem.className.indexOf('js-back') > -1) {
        renderList();
      }
    });
  };

  return {
    init: init
  };
})();

app.init();
