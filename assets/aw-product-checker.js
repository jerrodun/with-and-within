if( typeof jQuery === 'function' && parseFloat( jQuery.fn.jquery ) > 3 ){
  start( jQuery )
} else {
  loadAndStart()
}

async function getScript( url ){
  await new Promise( (resolve, reject) => {
    const script = document.createElement( 'script' )
    const head = document.getElementsByTagName('head')[0]
    let done = false
    script.src = url
    script.integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
    script.crossOrigin="anonymous"
    script.onload = script.onreadystatechange = function(){
      if( !done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')){
        done = true
        resolve()
      }
    }
    head.appendChild( script )
  })
}
async function loadAndStart(){
  await getScript( 'https://code.jquery.com/jquery-3.6.0.min.js'  )
  jQuery.noConflict()
  start( jQuery )
}
function start ( $ ) {
  const SkinSalvation = {}


  SkinSalvation.IngredientsTable = function( $wrap ){
    $wrap.$wrap = $wrap
    $.extend( $wrap, IngredientsTableMethods )
    $wrap.initTable()
    return $wrap
  }
  var IngredientsTableMethods = {
    $table: $('<table class="ingredients-table">'),
    $thead: $('<thead>'),
    $tbody: $('<tbody>'),
    clearResults: function(){
      this.find('span.highlightWord').each(
        function() {
          $(this).parent().text( $(this).text() );
        }
      )
      this.find('.ingredients-table--result').remove()
    },
    findIngredients: function( terms ){
      const normalized = terms.map( this.normalizeIngredientName )
      this.clearResults()
      this.highlightIngredients( normalized )
      this.populateResults( normalized )
    },
    generateDetails: function( ingredient ){
      const $table = $('<table>')
      const $head = $('<thead>')
      const $body = $('<tbody>')
      $table.append( $head, $body )

      const config = SkinSalvation.ingredients.config.details
      let $row = $('<tr>')
      config.forEach(
        ({ heading }) => {
          $row.append( $(`<th>${heading}</th>`))
        }
      )
      $head.html( $row )

      $row = $('<tr>')
      config.forEach(
        ({ name }) => {
          const $td = $(`<td>${ ingredient[name] || '' }</td>`)
          if( name === 'ss_safe_rating' ){
            $td.attr('data-ss-rating', ingredient[name] )
          }
          $row.append( $td )
        }
      )
      $body.html( $row )
      return $table
    },
    getRows: function( ingredients ){
      var self = this
      var $rows = $()
      ingredients = ingredients.map( function( v ){
        return self.normalizeIngredientName( v )
      })
      ingredients = ingredients.filter( function( v ){ return v })
      this.getIngredientRows().each(
        function(){
          var ingredient = self.normalizeIngredientName( $(this).find('td').first().text() )
          if( ingredients.indexOf( ingredient ) !== -1 ){
            $rows = $rows.add( $(this) );
          }
        }
      );
      return $rows;
    },
    getIngredientRows: function(){
      if( this.ingredientRows === undefined ){
        var $rows = this.find('tbody tr:has(td)')
        this.ingredientRows = $rows;
      }
      return this.ingredientRows;
    },
    getIngredients: function(){
      if( this.ingredients === undefined ){
        var self = this
        var words = []
        this.getIngredientRows().each(
          function(){
            var word = self.normalizeIngredientName( $(this).find('td').first().text() )
            if( word.length > 1 ){
              words.push( word );
            }
          }
        )
        this.ingredients = words
      }
      return this.ingredients
    },
    hasIngredient: function( ingredient ){
      ingredient = this.normalizeIngredientName( ingredient )
      return this.getIngredients().indexOf( ingredient ) !== -1
    },
    highlightIngredients: function( ingredients ){
      var self = this
      $( this.getRows( ingredients ).get().reverse() ).each(
        function(){
          var $td = $(this).find('td').first()
          var text = $td.text()
          $td.html( $(`<span class="highlightWord">${text}</span>`) );
        }
      );
    },
    initHeader: function(){
      const $row = $('<tr>')
      SkinSalvation.ingredients.config.columns.forEach(
        ({ heading, name }) => {
          $row.append( `<th>${heading}</th>`)
        }
      )
      this.$thead.html( $row )
    },
    initRows: function(){
      const columns = SkinSalvation.ingredients.config.columns
      let letter = null
      SkinSalvation.ingredients.alphabetical.forEach(
        id => {
          const ingredient = SkinSalvation.ingredients.data[ id ]
          letter = this.insertLetterHeading( letter, ingredient.name )

          const $button = $('<button class="show-more">Show More</button>')
          this.insertIngredientRow( ingredient, $button )
          const $details = this.insertDetailsRow( ingredient )
          $button.click( function(){ $details.slideToggle('slow') } )
        }
      )
    },
    initTable: function(){
      this.initHeader()
      this.initRows()
      this.$table.append( this.$thead )
      this.$table.append( this.$tbody )
      this.$wrap.html( this.$table )
    },
    insertDetailsRow: function( ingredient ){
      const columns = SkinSalvation.ingredients.config.columns
      const $row = $('<tr class="ingredient-details__row"></tr>')
      const $cell = $(`<td colspan="${columns.length}">`)
      const $div = $('<div class="ingredient-details">')
      $div.html( this.generateDetails( ingredient ) )
      $div.appendTo( $cell )
      $cell.appendTo( $row )
      this.$tbody.append( $row )
      return $div
    },
    insertIngredientRow: function( ingredient, $button ){
      const columns = SkinSalvation.ingredients.config.columns
      const $row = $('<tr class="ingredients-table__row">')
      const ratingValue = parseInt( ingredient.average_clog_rating )
      if( ! isNaN( ratingValue ) ){
        let color = 'red'
        if( ratingValue < 3 ){ color = 'green' }
        else if( ratingValue < 4 ){ color = 'yellow' }
        $row.addClass( `rating-color--${color}` )
      }
      columns.forEach(
        ({ heading, name }) => {
          const value = ingredient[name]
          const $cell = $('<td>')
          if( heading === 'show more' ){
            $cell.html( $button )
          } else {
            $cell.html( value )
          }
          $row.append( $cell )
        }
      )
      this.$tbody.append( $row )
      SkinSalvation.ingredients.$rows[ingredient.id] = $row
    },
    insertLetterHeading: function( letter, name ){
      if( name.toLowerCase().startsWith( letter ) ){
        return letter
      } else {
        const newLetter = name[0].toLowerCase()
        const span = SkinSalvation.ingredients.config.columns.length
        this.$tbody.append( $(`<tr><th class="ingredients-table--letter-heading" colspan="${span}">${newLetter}</th></tr>`))
        return newLetter
      }
    },
    normalizeIngredientName: function( name ){
      return name.replace( /~|\*|\(.*\)/g ,'').trim().toLowerCase()
    },
    populateResults: function( terms ){
      const ingredients = SkinSalvation.ingredients
      const span = ingredients.config.columns.length
      const results = [ $(`<tr class="ingredients-table--result"><th colspan="${span}">Search Results</th></tr>`) ]
      terms.forEach( term => {
        const id = ingredients.name[ term ]
        if( id ){
          let $row = ingredients.$rows[ id ]
          const $details = $row.next().clone()
          $row = $row.clone()
          $row.find('.show-more').click( function(){
            $details.find('.ingredient-details').slideToggle('slow')
          } )
          results.push( $row.addClass('ingredients-table--result') )
          results.push( $details.addClass('ingredients-table--result' ) )
        }
      })
      if( results.length < 2 ){
        results.push( $(`<tr class="ingredients-table--result"><td colspan="${span}">No comedogenic ingredients found.</td></tr>`))
      }
      this.$tbody.prepend( results )
    }
  }


  SkinSalvation.SearchBox = function( $input, $table ){
    $.extend( this, SearchBoxMethods )
    this.table = $table
    this.wrap( $input ) // this.wrapper = wrapper div
    this.input = $input
    this.display = $('<div class="display">')
    this.display.appendTo( this.wrapper )
    var self = this
    this.input.on('input', function(){
      self.sanitizeInput()
      self.highlightTerms()
    } )
    return this
  }
  var SearchBoxMethods = {
    highlightTerms: function(){
      var self = this
      var highlighted = this.getQuery().split(',').map( function( value ){
        if( self.table.hasIngredient( value ) ){
          value = value.replace( value.trim(), '<span class="highlightWord">' + value.trim() + '</span>' )
        }
        return value
      })
      this.display.html( highlighted.join( ',') )
    },
    getQuery: function(){
      return this.input.text()
    },
    getTerms: function(){
      var query = this.getQuery()
      return query.split(',').map( function( value ){ return value.trim() })
    },
    sanitizeInput: function(){
      // Converts copy-pasted formatted text to plain text.
      var tmp = $('<div>').html(this.getQuery())
      this.input.text( tmp.text() )
      // the line above resets the cursor to the beginning of the text
      // the lines below set the cursor to the end
      var el = this.input[0]
      var range = document.createRange()
      var sel = window.getSelection();
      try{
        range.setStart(el, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch {
        //ignore errors
      }
    },
    wrap: function( $input ){
      this.wrapper = $input.wrap( '<div class="searchbox wrapper">' ).parent()
    }
  }

  var SearchBox = SkinSalvation.SearchBox
  var IngredientsTable = SkinSalvation.IngredientsTable

  $(document).ready( async function(){
    const headers = new Headers()
    const response = await fetch( 'http://awellnessdata.wpengine.com' )
    const data = await response.json()
    SkinSalvation.ingredients = data
    SkinSalvation.ingredients.$rows = []

    var $ingredientsTable = new IngredientsTable( $('.js-ingredients-table--wrap') )
    var $search = new SearchBox( $('.searchbox'), $ingredientsTable )

    $search.input.on( 'input textinput', function(){
      $ingredientsTable.findIngredients( $search.getTerms() )
    })
  });

  function getTermsInCSL( csl ){
    /* CSL = comma separated list
     * returns array of normalized terms:
     * - lower case
     * - trimmed
     * - removes ~ and *
     */
    csl = csl.toLowerCase().replace("~", "").replace("*", "");
    var terms = csl.split(',');
    terms = terms.map( function( term ){ return $.trim( term ); })
    return terms;
  }

}
