import type { TreeNodeData } from '@mantine/core'
import type { FC } from 'react'
import type { ITrackRecord } from '@/shared/types/record'
import { CTree, useTree } from '@/shared/ui-kit'
import { useLibraryStore } from '../../model/library-store'
import { createTreeSelector } from '../../model/library-store-selectors'

const selectMantineTree = createTreeSelector<TreeNodeData>(
  (track) => ({
    value: track.id,
    label: track.title ?? track.fileName,
    nodeProps: { type: 'track', data: track },
  }),
  (album, tracks) => ({
    value: album.id,
    label: album.album,
    hasChildren: true,
    children: tracks,
    nodeProps: { type: 'album', data: album },
  }),
  (artist, albums) => ({
    value: artist.id,
    label: artist.artist,
    hasChildren: true,
    children: albums,
    nodeProps: { type: 'artist', data: artist },
  }),
)

interface ILibraryTreeProps {
  onTrackSelected: (track: ITrackRecord) => void
}

export const LibraryTree: FC<ILibraryTreeProps> = ({ onTrackSelected }) => {
  const tree = useTree()
  const data = useLibraryStore(selectMantineTree)
  const getAlbumsByArtistId = useLibraryStore((s) => s.getAlbumsByArtistId)
  const getTracksByAlbumId = useLibraryStore((s) => s.getTracksByAlbumId)

  const handleNodeClick = (node: TreeNodeData) => {
    const { type, data: nodeData } = node.nodeProps ?? {}

    if (type === 'artist') {
      tree.toggleExpanded(node.value)
      getAlbumsByArtistId(node.value)
    } else if (type === 'album') {
      tree.toggleExpanded(node.value)
      getTracksByAlbumId(node.value)
    } else if (type === 'track') {
      onTrackSelected(nodeData as ITrackRecord)
    }
  }

  return (
    <CTree
      data={data}
      tree={tree}
      renderNode={({ node, expanded, elementProps }) => (
        <div {...elementProps} onClick={() => handleNodeClick(node)}>
          {node.nodeProps?.type !== 'track' && <span>{expanded ? '▾' : '▸'}</span>}
          <span>{node.label}</span>
        </div>
      )}
    />
  )
}
