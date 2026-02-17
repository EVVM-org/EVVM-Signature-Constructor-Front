'use client'

export const TitleAndLink = ({
  title,
  link,
}: {
  title: string
  link: string
}) => {
  return (
    <div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textAlign: 'center',
          color: '#3A9EE3',
          fontSize: '1rem',
          fontWeight: '800',
          marginBottom: '3rem',
        }}
      >
        Learn more about {title.toLocaleLowerCase()} signature structure here
      </a>
    </div>
  )
}
