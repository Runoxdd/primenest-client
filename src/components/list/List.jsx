import './list.scss'
import Card from"../card/Card"

function List({posts}){
  return (
    <div className='list'>
      {posts.length > 0 ? (
        posts.map(item=>(
          <Card key={item.id} item={item}/>
        ))
      ) : (
        <div className="noItems">
          <div className="icon">🔭</div>
          <p>No properties detected in this sector.</p>
          <span>Try adjusting your filters to expand the search.</span>
        </div>
      )}
    </div>
  )
}

export default List