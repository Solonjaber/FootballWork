
import React from 'react';
import { useMatchStore } from '@/store/matchStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import TeamDisplay from '@/components/TeamDisplay';

const HistoryPage: React.FC = () => {
  const { matchHistory } = useMatchStore();
  
  if (matchHistory.length === 0) {
    return (
      <div className="container max-w-md mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Histórico</h1>
        <p className="text-muted-foreground">
          Nenhuma partida encontrada no histórico.
        </p>
        <p className="mt-2 text-sm">
          Gere times e salve partidas para vê-las aqui.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Histórico</h1>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {matchHistory.map((match) => (
          <AccordionItem 
            key={match.id} 
            value={match.id}
            className="border bg-card rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex flex-col items-start">
                <div className="text-lg font-medium">
                  {format(new Date(match.date), "dd 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(match.date), "HH:mm", { locale: ptBR })}
                  {match.location && ` • ${match.location}`}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {match.notes && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {match.notes}
                  </div>
                )}
                
                <div className="grid gap-4">
                  <TeamDisplay team={match.teamA} className="team-a" />
                  <TeamDisplay team={match.teamB} className="team-b" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default HistoryPage;
