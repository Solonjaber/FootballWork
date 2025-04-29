
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/store/playerStore';
import { Player } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';

interface AddPlayerFormProps {
  onClose: () => void;
  editPlayer?: Player | null;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onClose, editPlayer }) => {
  const [name, setName] = useState(editPlayer?.name || '');
  const [skillLevel, setSkillLevel] = useState(editPlayer?.skillLevel || 5);
  const [position, setPosition] = useState(editPlayer?.position || '');
  
  const { addPlayer, updatePlayer } = usePlayerStore();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do jogador.",
        variant: "destructive"
      });
      return;
    }
    
    if (editPlayer) {
      updatePlayer({
        ...editPlayer,
        name,
        skillLevel,
        position: position.trim() || undefined
      });
      toast({
        title: "Jogador atualizado",
        description: `${name} foi atualizado com sucesso.`
      });
    } else {
      addPlayer({
        name,
        skillLevel,
        position: position.trim() || undefined,
        attendance: true
      });
      toast({
        title: "Jogador adicionado",
        description: `${name} foi adicionado à lista.`
      });
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Jogador</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="skill">Nível de Habilidade: {skillLevel}</Label>
          <span className="text-sm text-muted-foreground">1-10</span>
        </div>
        <Slider
          id="skill"
          min={1}
          max={10}
          step={1}
          value={[skillLevel]}
          onValueChange={(value) => setSkillLevel(value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">Posição (opcional)</Label>
        <Input
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Ex: Atacante, Goleiro, etc."
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {editPlayer ? 'Atualizar' : 'Adicionar'} Jogador
        </Button>
      </div>
    </form>
  );
};

export default AddPlayerForm;
