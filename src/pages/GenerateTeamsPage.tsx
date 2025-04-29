
import React, { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useMatchStore } from '@/store/matchStore';
import { generateBalancedTeams } from '@/utils/teamGenerator';
import TeamDisplay from '@/components/TeamDisplay';
import FootballField from '@/components/FootballField';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Team, Player } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { Dices, ShieldAlert, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const GenerateTeamsPage: React.FC = () => {
  const { players, toggleYellowCard, toggleRedCard, resetCards } = usePlayerStore();
  const { setCurrentTeams, saveMatch, currentTeams, clearCurrentTeams } = useMatchStore();
  const { toast } = useToast();
  
  const [playersPerTeam, setPlayersPerTeam] = useState<number>(5);
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "field">("list");
  
  const presentPlayers = players.filter(p => p.attendance);
  const totalPlayersNeeded = playersPerTeam * 2;
  const hasEnoughPlayers = presentPlayers.length >= totalPlayersNeeded;
  
  const handleGenerateTeams = () => {
    if (!hasEnoughPlayers) {
      toast({
        title: "Jogadores insuficientes",
        description: `Precisamos de pelo menos ${totalPlayersNeeded} jogadores presentes.`,
        variant: "destructive"
      });
      return;
    }
    
    const [teamA, teamB] = generateBalancedTeams(players, playersPerTeam);
    setCurrentTeams([teamA, teamB]);
    
    toast({
      title: "Times gerados!",
      description: "Os times foram sorteados com sucesso."
    });
  };
  
  const handleSaveMatch = () => {
    saveMatch(location, notes);
    toast({
      title: "Partida salva",
      description: "Esta partida foi salva no histórico."
    });
    clearCurrentTeams();
    setLocation('');
    setNotes('');
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleResetCards = () => {
    resetCards();
    toast({
      title: "Cartões resetados",
      description: "Todos os cartões foram removidos."
    });
  };
  
  return (
    <div className="container max-w-md mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Gerar Times</h1>
      
      <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Configuração</h2>
            <p className="text-sm text-muted-foreground">
              {presentPlayers.length} jogadores disponíveis
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="playersPerTeam">Jogadores por time:</Label>
            <Select
              value={playersPerTeam.toString()}
              onValueChange={(value) => setPlayersPerTeam(parseInt(value))}
            >
              <SelectTrigger className="w-16">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="11">11</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleGenerateTeams}
          disabled={!hasEnoughPlayers}
        >
          <Dices className="mr-2 h-4 w-4" />
          Sortear Times
        </Button>

        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetCards}
          >
            <RotateCcw size={16} className="mr-1" /> Resetar Cartões
          </Button>
        </div>
        
        {!hasEnoughPlayers && (
          <p className="text-sm text-destructive mt-2">
            Precisamos de pelo menos {totalPlayersNeeded} jogadores presentes.
          </p>
        )}
      </div>
      
      {currentTeams[0] && currentTeams[1] && (
        <div className="animate-bounce-in">
          <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as "list" | "field")} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="field">Campo</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-4">
              <div className="mb-6">
                <TeamDisplay team={currentTeams[0] as Team} className="team-a" />
                <div className="text-center my-2">VS</div>
                <TeamDisplay team={currentTeams[1] as Team} className="team-b" />
              </div>
            </TabsContent>
            <TabsContent value="field" className="mt-4">
              <FootballField 
                teamA={currentTeams[0] as Team} 
                teamB={currentTeams[1] as Team} 
                onPlayerClick={handlePlayerClick}
              />
            </TabsContent>
          </Tabs>
          
          <div className="bg-card p-4 rounded-lg shadow-sm space-y-4">
            <h3 className="font-medium">Salvar esta partida</h3>
            
            <div className="space-y-2">
              <Label htmlFor="location">Local (opcional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Quadra do Parque"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Jogo amistoso"
              />
            </div>
            
            <Button className="w-full" onClick={handleSaveMatch}>
              Salvar no Histórico
            </Button>
          </div>
        </div>
      )}

      {/* Dialog para gerenciar cartões */}
      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Jogador</DialogTitle>
            <DialogDescription>
              {selectedPlayer ? selectedPlayer.name : ''} - Nível {selectedPlayer?.skillLevel ?? ''}
              {selectedPlayer?.position && ` - ${selectedPlayer.position}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant={selectedPlayer?.yellowCard ? "default" : "outline"}
              className="flex items-center" 
              onClick={() => selectedPlayer && toggleYellowCard(selectedPlayer.id)}
            >
              <div className="w-4 h-6 bg-yellow-400 mr-2"></div>
              Cartão Amarelo
            </Button>
            <Button 
              variant={selectedPlayer?.redCard ? "default" : "outline"}
              className="flex items-center"
              onClick={() => selectedPlayer && toggleRedCard(selectedPlayer.id)}
            >
              <div className="w-4 h-6 bg-red-500 mr-2"></div>
              Cartão Vermelho
            </Button>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateTeamsPage;
