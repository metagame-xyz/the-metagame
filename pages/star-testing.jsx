import example from '../public/example.svg'

export default function Home() {
  return (
    <div className="container">
      <marquee>SVG example!</marquee>
      <example />
      <style jsx>{`
        .container {
          width: 600px;
          margin: 100px auto;
        }
      `}</style>
    </div>
  )
}