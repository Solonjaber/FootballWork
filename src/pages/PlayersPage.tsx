
import React, { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import PlayerCard from '@/components/PlayerCard';
import AddPlayerForm from '@/components/AddPlayerForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Player } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';

const PlayersPage: React.FC = () => {
  const { players, toggleAttendance, removePlayer } = usePlayerStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const { toast } = useToast();

  const handleEdit = (player: Player) => {
    setPlayerToEdit(player);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    removePlayer(id);
    toast({
      title: "Jogador removido",
      description: "O jogador foi removido da lista."
    });
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setPlayerToEdit(null);
  };

  const presentPlayers = players.filter(p => p.attendance).length;

  return (
    <div className="container max-w-md mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jogadores</h1>
          <p className="text-muted-foreground">
            <Users size={16} className="inline mr-1" /> 
            {presentPlayers} presentes de {players.length} total
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Nenhum jogador cadastrado</p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            Adicionar Jogadores
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onToggleAttendance={toggleAttendance}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {playerToEdit ? 'Editar Jogador' : 'Adicionar Jogador'}
            </DialogTitle>
          </DialogHeader>
          <AddPlayerForm onClose={closeDialog} editPlayer={playerToEdit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayersPage;
